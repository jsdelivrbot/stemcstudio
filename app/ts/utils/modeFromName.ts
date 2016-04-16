const extensionToMode: { [ext: string]: string } = {}

extensionToMode['coffee'] = 'CoffeeScript'
extensionToMode['css'] = 'CSS'
extensionToMode['html'] = 'HTML'
extensionToMode['js'] = 'JavaScript'
extensionToMode['less'] = 'LESS'
extensionToMode['md'] = 'Markdown'
extensionToMode['py'] = 'Python'
extensionToMode['sass'] = 'SASS'
extensionToMode['ts'] = 'TypeScript'

export default function(name: string): string {
    const period = name.lastIndexOf('.')
    if (period >= 0) {
        const extension = name.substring(period + 1)
        return extensionToMode[extension]
    }
    return void 0
}
