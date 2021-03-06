import { Component, ComponentID } from '@teambit/component';
import { ExecutionContext } from '@teambit/environments';
import { Network } from '@teambit/isolator';

export interface BuildContext extends ExecutionContext {
  /**
   * all components about to be built/tagged.
   */
  components: Component[];

  /**
   * graph of capsules ready to be built.
   */
  capsuleGraph: Network;
}

export type ArtifactProps = {
  dirName?: string;
  fileName?: string;
};

export type ComponentResult = {
  id: ComponentID;
  // TODO: change to type serializable
  data?: any;
  errors: Array<Error | string>;
  warning?: string[];
};

export interface BuildResults {
  components: ComponentResult[];
  artifacts: ArtifactProps[];
}

export type TaskLocation = 'start' | 'end';

export interface BuildTask {
  /**
   * extensionId hosting this task.
   * @todo: should be automatically injected by Harmony
   */
  extensionId: string;

  /**
   * description of what the task does.
   * if available, the logger will log it show it in the status-line.
   * it's helpful to distinguish multiple tasks of the same extension.
   */
  description?: string;

  /**
   * where to put the task, before the env pipeline or after
   */
  location?: TaskLocation;

  /**
   * execute a task in a build context
   */
  execute(context: BuildContext): Promise<BuildResults>;
}
