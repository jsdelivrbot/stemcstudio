/**
 * This is the contract for what is expected for the ng-model attribute.
 */
interface IExplorerModel {
    [name: string]: { isOpen: boolean; selected: boolean }
}

export default IExplorerModel;
