export class Route{
    #routesPage = {};
    #regex = {
        exp:/^\/[a-z0-9ñ*-]*$/,
        notExp:true
    };
    #rootNode=null;
    #navbarNode=null;

    constructor({exp=/.*/gi, notExp=true} = {}){
        this.#regex.exp=exp;
        this.#regex.notExp=notExp;
    }
    #setRoutes = (routes=[]) => {
        routes.map((route, index) => {
            if(this.#RouteValidator(route.path)) throw new Error(`La ruta ${route.path} en el indice ${index} no cumple con la estructura permitida`);
            this.#routesPage[route.path] = route.view;
        });
    };
    #RouteValidator = path => {
        if(this.#regex.notExp) return !this.#regex.exp.test(path)
        return this.#regex.exp.test(path)
    };
    #setRootNode = (node=null) => {
        if(node === null){
            const newRootNode = document.createElement('div');
            newRootNode.id = "root";
            node = newRootNode;
        }
        this.#rootNode = node;
        document.querySelector('body').appendChild(this.#rootNode);
    };
    #showView = () => {
        if(!this.#routesPage[window.location.pathname] && !this.#routesPage['/*']){ 
            this.#getViewPages('');
            return;
        }
        else if(!this.#routesPage[window.location.pathname] && this.#routesPage['/*']){
            this.#getViewPages(this.#routesPage['/*']);
            return
        }
        this.#getViewPages(this.#routesPage[window.location.pathname]);
    };
    #getViewPages = (view) => {
        if(this.#rootNode.hasChildNodes()){
            while (this.#rootNode.firstChild) {
                this.#rootNode.removeChild(this.#rootNode.firstChild);
              }
        }
        if(view.nodeType !== 1 && view.nodeType !== 11) {
            this.#rootNode.textContent = view;
            return;
        } else if(view.nodeType === 11) {
            this.#rootNode.appendChild(document.importNode(view, true));
            return;
        }
        this.#rootNode.appendChild(view);
    };
    #setNavbar = (navbarNode) => {
        if(navbarNode === null) return;
        this.#navbarNode = navbarNode;

        this.#navbarNode.addEventListener( 'click', ({target}) => {
            window.history.pushState(null, '', target.dataset.route);
            this.#showView()
        });
    };
    #setPopstate = () =>{
        window.addEventListener('popstate', ev => {
            this.#showView();
        });
    };
    setNavPages = (routes=[], navbarNode=null, rootNode=null) => {
        this.#setRoutes(routes);
        this.#setRootNode(rootNode);
        this.#showView();
        this.#setNavbar(navbarNode);
        this.#setPopstate();
    };
    getRoutes = () => console.log(this.#routesPage);
    getRegex = () => console.log(this.#regex);
    getNavbarNode = () => console.log(this.#navbarNode);
    getRootNode = () => console.log(this.#rootNode);
};