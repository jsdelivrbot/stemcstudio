/**
 * Computes the string to be used for the 'type' attribute in a `script` tag for a GLSL shader.
 * While the 'type' attribute is used primarily to prevent the browser from trying to interpret
 * the content of the script tag, there is a convention for naming shaders.
 * 
 * The current implementation is a guess based upon the existence of the return variables.
 * In future, we could parse the content to unambiguously determine the shader type.
 */
export function shaderTypeFromContent(content: string): string {
    const mayBeVS = content.includes('gl_Position');
    const mayBeFS = content.includes('gl_FragColor');
    if (mayBeVS) {
        if (mayBeFS) {
            // For debugging ;)
            return 'x-shader/x-both';
        }
        else {
            return 'x-shader/x-vertex';
        }
    }
    else {
        if (mayBeFS) {
            return 'x-shader/x-fragment';
        }
        else {
            // For debugging ;)
            return 'x-shader/x-neither';
        }
    }
}
