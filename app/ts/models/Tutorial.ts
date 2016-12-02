interface Tutorial {
    gistId: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    /**
     * 
     */
    docsUrl: string;
    /**
     * 
     */
    category: 'EIGHT' | 'STEMCstudio' | 'THREE' | 'UNITS';
    /**
     * Determines whether the tutorial is displayed inside an iframe.
     */
    showEmbedded?: boolean;
    /**
     * 
     */
    gistUrl?: string;
}

export default Tutorial;
