import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
    
    @IBOutlet weak var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!
    
    // URL de tu aplicación web - cambiar por la URL de producción cuando esté lista
    private let webAppURL = "https://3d7ef0ba-012e-403c-ba0b-02f65f1bd8d4-00-1blcj7i76bf6j.worf.replit.dev"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupWebView()
        setupActivityIndicator()
        loadWebApp()
        
        // Configurar el título de la navegación
        self.title = "GTR CUBAUTO"
        
        // Configurar la apariencia de la barra de navegación
        configureNavigationBar()
    }
    
    private func setupWebView() {
        // Configurar WebKit
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        // Configurar las preferencias
        let preferences = WKPreferences()
        preferences.javaScriptEnabled = true
        configuration.preferences = preferences
        
        // Si webView no está conectado por IBOutlet, crearlo programáticamente
        if webView == nil {
            webView = WKWebView(frame: view.bounds, configuration: configuration)
            webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            view.addSubview(webView)
        }
        
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        
        // Configurar el scroll para que se vea mejor en dispositivos móviles
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic
        
        // Permitir zoom
        webView.scrollView.maximumZoomScale = 3.0
        webView.scrollView.minimumZoomScale = 0.5
    }
    
    private func setupActivityIndicator() {
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        activityIndicator.color = .systemRed
        view.addSubview(activityIndicator)
    }
    
    private func configureNavigationBar() {
        // Configurar la apariencia de la barra de navegación
        navigationController?.navigationBar.prefersLargeTitles = false
        
        // Agregar botón de recarga
        let refreshButton = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(refreshWebView))
        navigationItem.rightBarButtonItem = refreshButton
        
        // Agregar botón de inicio
        let homeButton = UIBarButtonItem(title: "Inicio", style: .plain, target: self, action: #selector(goHome))
        navigationItem.leftBarButtonItem = homeButton
    }
    
    private func loadWebApp() {
        guard let url = URL(string: webAppURL) else {
            showErrorAlert(message: "URL de la aplicación no válida")
            return
        }
        
        var request = URLRequest(url: url)
        request.cachePolicy = .reloadIgnoringLocalCacheData
        
        // Agregar headers para mejorar la compatibilidad
        request.setValue("Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1", forHTTPHeaderField: "User-Agent")
        
        webView.load(request)
    }
    
    @objc private func refreshWebView() {
        webView.reload()
    }
    
    @objc private func goHome() {
        loadWebApp()
    }
    
    private func showErrorAlert(message: String) {
        let alert = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Reintentar", style: .default) { _ in
            self.loadWebApp()
        })
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        present(alert, animated: true)
    }
    
    // MARK: - WKNavigationDelegate
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        activityIndicator.startAnimating()
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        activityIndicator.stopAnimating()
        
        // Inject CSS para mejorar la experiencia móvil
        let cssString = """
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            // Mejorar el toque en elementos
            var style = document.createElement('style');
            style.innerHTML = `
                * {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -webkit-tap-highlight-color: rgba(0,0,0,0.1);
                }
                button, a, input, textarea, select {
                    -webkit-user-select: auto;
                    -webkit-touch-callout: default;
                }
                body {
                    -webkit-overflow-scrolling: touch;
                }
            `;
            document.head.appendChild(style);
        """
        
        webView.evaluateJavaScript(cssString, completionHandler: nil)
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        showErrorAlert(message: "Error al cargar la aplicación: \(error.localizedDescription)")
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        
        let nsError = error as NSError
        if nsError.code == NSURLErrorNotConnectedToInternet {
            showErrorAlert(message: "No hay conexión a Internet. Verifique su conexión y vuelva a intentar.")
        } else {
            showErrorAlert(message: "Error al cargar la aplicación: \(error.localizedDescription)")
        }
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Permitir navegación dentro del dominio de la app
        if let url = navigationAction.request.url {
            let urlString = url.absoluteString
            
            // Permitir navegación interna y enlaces externos específicos
            if urlString.contains("gtrcubauto") || urlString.contains("replit.dev") || 
               urlString.contains("stripe.com") || urlString.contains("paypal.com") {
                decisionHandler(.allow)
            } else if url.scheme == "tel" || url.scheme == "mailto" || url.scheme == "sms" {
                // Manejar enlaces de teléfono, email y SMS
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
            } else {
                // Para otros enlaces externos, abrirlos en Safari
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
            }
        } else {
            decisionHandler(.allow)
        }
    }
    
    // MARK: - WKUIDelegate
    
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        // Manejar ventanas emergentes (popups) cargándolas en la WebView actual
        if navigationAction.targetFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
    
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: "GTR CUBAUTO", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            completionHandler()
        })
        present(alert, animated: true)
    }
    
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: "GTR CUBAUTO", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Sí", style: .default) { _ in
            completionHandler(true)
        })
        alert.addAction(UIAlertAction(title: "No", style: .cancel) { _ in
            completionHandler(false)
        })
        present(alert, animated: true)
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
}