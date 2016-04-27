import Renderer from './Renderer';

export default function createRenderer(container: HTMLElement): Renderer {
    return new Renderer(container);
}