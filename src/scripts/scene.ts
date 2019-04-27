import { TemplateResult } from 'lit-html';
import { start } from './start';

/**
 * interface for a scene
 */
export interface Scene<S, A> {
    /**
     * name of the scene
     */
    name: string
    /**
     * the default arguments for the scene
     */
    defaultArgs: A
    /**
     * render a state
     * @param state state for the scene
     */
    render(state: S): TemplateResult
    /**
     * start the scene
     * @param args the arguments for the scene
     * @param state setter for the state of the scene
     */
    start(args: A, setState: (st: S) => void): void
    /**
     * deactivate the scene
     */
    stop(): void
}