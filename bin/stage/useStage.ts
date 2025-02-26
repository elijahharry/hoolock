import { createStage } from "./createStage";

export type StageCallback = (stage: { dir: string }) => void | Promise<void>;

const useStage = async (
  ...args:
    | [deps: Record<string, string>, callback: StageCallback]
    | [callback: StageCallback]
) => {
  const [deps, callback] = args.length === 1 ? [{}, args[0]] : args;
  const stage = await createStage(deps);
  await callback({
    dir: stage,
  });
};

export { useStage };
