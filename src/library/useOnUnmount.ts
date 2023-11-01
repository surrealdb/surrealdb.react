import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const useOnUnmount = (
    callback: EffectCallback,
    dependencies?: DependencyList
) => {
    const isUnmounting = useRef(false);

    useEffect(
        () => () => {
            isUnmounting.current = true;
        },
        []
    );

    useEffect(
        () => () => {
            if (isUnmounting.current) {
                callback();
            }
        },
        dependencies
    );

    return !isUnmounting.current;
};

export default useOnUnmount;
