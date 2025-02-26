const listify = <T, R>(
  target: (object: T, callback: (value: R) => any) => void
) => {
  return (object: T) => {
    const list: R[] = [];
    target(object, (value) => list.push(value));
    return list;
  };
};

export default listify;
