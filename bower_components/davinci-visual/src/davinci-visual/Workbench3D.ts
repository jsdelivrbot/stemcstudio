module visual {
function removeElementsByTagName(doc: Document, tagName: string) {
  var elements = doc.getElementsByTagName(tagName);
  for (var i = elements.length - 1; i >= 0; i--) {
    var e = elements[i];
    e.parentNode.removeChild(e);
  }
}

export class Workbench3D
{
  public canvas: HTMLCanvasElement;
  public wnd: Window;
  private sizer: EventListener;
  constructor(canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, controls, wnd: Window)
  {
    this.canvas = canvas;
    this.wnd = wnd;
    function onWindowResize(event)
    {
      var width  = wnd.innerWidth;
      var height = wnd.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      controls.handleResize();
    }
    this.sizer = onWindowResize;
  }
  setUp()
  {
    this.wnd.document.body.insertBefore(this.canvas, this.wnd.document.body.firstChild);
    this.wnd.addEventListener('resize', this.sizer, false);
    this.sizer(null);

  }
  tearDown()
  {
    this.wnd.removeEventListener('resize', this.sizer, false);
    removeElementsByTagName(this.wnd.document, "canvas");
  }
}
}