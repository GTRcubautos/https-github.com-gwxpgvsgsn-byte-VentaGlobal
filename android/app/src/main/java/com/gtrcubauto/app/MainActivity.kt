package com.gtrcubauto.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.webkit.*
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.gtrcubauto.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    
    // URL de la aplicación web - cambiar por la URL de producción
    private val webAppUrl = "https://3d7ef0ba-012e-403c-ba0b-02f65f1bd8d4-00-1blcj7i76bf6j.worf.replit.dev"
    
    // Manejo de permisos
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        permissions.entries.forEach { permission ->
            val isGranted = permission.value
            if (!isGranted) {
                Toast.makeText(
                    this,
                    "Permiso ${permission.key} es necesario para algunas funcionalidades",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupToolbar()
        setupWebView()
        setupSwipeRefresh()
        checkPermissions()
        
        loadWebApp()
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.apply {
            title = "GTR CUBAUTO"
            setDisplayShowTitleEnabled(true)
        }
    }
    
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView = binding.webView
        
        // Configurar WebView
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            builtInZoomControls = true
            displayZoomControls = false
            setSupportZoom(true)
            useWideViewPort = true
            loadWithOverviewMode = true
            allowFileAccess = true
            allowContentAccess = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            userAgentString = "Mozilla/5.0 (Linux; Android ${android.os.Build.VERSION.RELEASE}; ${android.os.Build.MODEL}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36 GTRCubaautoApp/1.0"
        }
        
        // Cliente WebView personalizado
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                super.onPageStarted(view, url, favicon)
                binding.progressBar.visibility = android.view.View.VISIBLE
            }
            
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                binding.progressBar.visibility = android.view.View.GONE
                swipeRefreshLayout.isRefreshing = false
                
                // Inyectar CSS para mejorar la experiencia móvil
                injectMobileOptimizations()
            }
            
            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                binding.progressBar.visibility = android.view.View.GONE
                swipeRefreshLayout.isRefreshing = false
                showErrorDialog("Error al cargar la aplicación: ${error?.description}")
            }
            
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                
                return when {
                    url.contains("gtrcubauto") || url.contains("replit.dev") -> {
                        // Navegación interna
                        false
                    }
                    url.contains("stripe.com") || url.contains("paypal.com") -> {
                        // Proveedores de pago
                        false
                    }
                    url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:") -> {
                        // Enlaces de comunicación
                        try {
                            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        } catch (e: Exception) {
                            Toast.makeText(this@MainActivity, "No se puede abrir: $url", Toast.LENGTH_SHORT).show()
                        }
                        true
                    }
                    else -> {
                        // Enlaces externos
                        try {
                            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        } catch (e: Exception) {
                            Toast.makeText(this@MainActivity, "No se puede abrir: $url", Toast.LENGTH_SHORT).show()
                        }
                        true
                    }
                }
            }
        }
        
        // Cliente Chrome personalizado
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                binding.progressBar.progress = newProgress
            }
            
            override fun onJsAlert(
                view: WebView?,
                url: String?,
                message: String?,
                result: JsResult?
            ): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("GTR CUBAUTO")
                    .setMessage(message)
                    .setPositiveButton("OK") { _, _ -> result?.confirm() }
                    .setCancelable(false)
                    .show()
                return true
            }
            
            override fun onJsConfirm(
                view: WebView?,
                url: String?,
                message: String?,
                result: JsResult?
            ): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("GTR CUBAUTO")
                    .setMessage(message)
                    .setPositiveButton("Sí") { _, _ -> result?.confirm() }
                    .setNegativeButton("No") { _, _ -> result?.cancel() }
                    .setCancelable(false)
                    .show()
                return true
            }
        }
    }
    
    private fun setupSwipeRefresh() {
        swipeRefreshLayout = binding.swipeRefreshLayout
        swipeRefreshLayout.setOnRefreshListener {
            webView.reload()
        }
        swipeRefreshLayout.setColorSchemeResources(
            R.color.colorPrimary,
            R.color.colorAccent
        )
    }
    
    private fun checkPermissions() {
        val permissions = arrayOf(
            Manifest.permission.CAMERA,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.READ_EXTERNAL_STORAGE
        )
        
        val permissionsToRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        
        if (permissionsToRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }
    
    private fun loadWebApp() {
        webView.loadUrl(webAppUrl)
    }
    
    private fun injectMobileOptimizations() {
        val javascript = """
            // Configurar viewport para móviles
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            // Mejorar la experiencia táctil
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
                    min-height: 44px;
                    padding: 8px;
                }
                body {
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;
                }
                .modal {
                    -webkit-overflow-scrolling: touch;
                }
            `;
            document.head.appendChild(style);
            
            // Notificar que la app móvil está lista
            if (typeof window.mobileAppReady === 'function') {
                window.mobileAppReady();
            }
        """.trimIndent()
        
        webView.evaluateJavascript(javascript, null)
    }
    
    private fun showErrorDialog(message: String) {
        AlertDialog.Builder(this)
            .setTitle("Error")
            .setMessage(message)
            .setPositiveButton("Reintentar") { _, _ -> loadWebApp() }
            .setNegativeButton("Cancelar", null)
            .show()
    }
    
    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_refresh -> {
                webView.reload()
                true
            }
            R.id.action_home -> {
                loadWebApp()
                true
            }
            R.id.action_share -> {
                shareApp()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
    
    private fun shareApp() {
        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, "¡Descarga GTR CUBAUTO! La mejor app para repuestos automotrices: $webAppUrl")
            putExtra(Intent.EXTRA_SUBJECT, "GTR CUBAUTO - Repuestos Automotrices")
        }
        startActivity(Intent.createChooser(shareIntent, "Compartir GTR CUBAUTO"))
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
    
    override fun onResume() {
        super.onResume()
        webView.onResume()
    }
    
    override fun onPause() {
        super.onPause()
        webView.onPause()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}