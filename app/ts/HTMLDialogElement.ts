// This does not seem to exist yet.
interface HTMLDialogElement extends HTMLElement {
  open: boolean;
  returnValue: string;
  show: (anchor?: MouseEvent|Element) => void;
  showModal: (anchor?: MouseEvent|Element) => void;
  close: (returnValue?: string) => void
}
