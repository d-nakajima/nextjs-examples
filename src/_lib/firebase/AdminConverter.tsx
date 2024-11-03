import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";
import { z } from "zod";

type GetAppModelType<T> = {
  snapshot: QueryDocumentSnapshot;
  createdAt: Date;
  updatedAt: Date;
} & T;
type SetAppModelType<T> = {
  snapshot?: QueryDocumentSnapshot;
  createdAt?: Date;
  updatedAt?: Date;
} & T;

export type AdminDbModelType<T> = {
  createdAt: Date;
  updatedAt: Date;
} & T;

export const adminConverterOnGet = <T extends z.AnyZodObject>(
  schema: T
): FirestoreDataConverter<GetAppModelType<z.infer<T>>> => ({
  toFirestore: () => {
    throw new Error("Use adminConverterOnSet on SET operations");
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<GetAppModelType<z.infer<T>>>
  ): GetAppModelType<z.infer<T>> => {
    const { createdAt, updatedAt, ...data } = snapshot.data();
    const parsedData = schema.strict().parse(data);
    return {
      ...parsedData,
      snapshot,
      createdAt: updatedAt,
      updatedAt: createdAt,
    };
  },
});

export const adminConverterOnSet = <T extends z.AnyZodObject>(
  schema: T
): FirestoreDataConverter<SetAppModelType<z.infer<T>>> => ({
  toFirestore: (data: SetAppModelType<z.infer<T>>) => {
    const { snapshot: _s, createdAt, updatedAt: _u, ...rest } = data;
    const result = schema.strict().parse(rest);
    return {
      ...result,
      createdAt: createdAt ?? new Date(),
      updatedAt: new Date(),
    };
  },
  fromFirestore: () => {
    throw new Error("Use adminConverterOnSet on SET operations");
  },
});

export function collectionSet(schema: z.AnyZodObject, collectionPath: string) {
  getFirestore()
    .collection(collectionPath)
    .withConverter(adminConverterOnSet(schema));
}

export function collectionGet(schema: z.AnyZodObject, collectionPath: string) {
  getFirestore()
    .collection(collectionPath)
    .withConverter(adminConverterOnGet(schema));
}

export function documentGet(
  schema: z.AnyZodObject,
  collectionPath: string,
  documentPath: string
) {
  getFirestore()
    .collection(collectionPath)
    .doc(documentPath)
    .withConverter(adminConverterOnGet(schema));
}

export function documentSet(
  schema: z.AnyZodObject,
  collectionPath: string,
  documentPath: string
) {
  getFirestore()
    .collection(collectionPath)
    .doc(documentPath)
    .withConverter(adminConverterOnSet(schema));
}
