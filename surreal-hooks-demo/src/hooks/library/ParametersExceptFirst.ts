export type ParametersExceptFirst<F> = F extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arg0: any,
    ...rest: infer R
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any
    ? R
    : never;
