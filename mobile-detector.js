// Función para detectar dispositivos móviles
function isMobileDevice() {
    // Verificar por user agent - más específico para móviles reales
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android.*mobile|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
    
    // Verificar por tamaño de pantalla - más restrictivo
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    
    // Solo considerar móvil si es muy pequeño (teléfonos)
    const isSmallScreen = screenWidth <= 480 || (screenWidth <= 768 && screenHeight <= 600);
    
    // Verificar si es específicamente un teléfono
    const isPhone = /android.*mobile|iphone|ipod|blackberry|iemobile/i.test(userAgent);
    
    // Excluir tablets y laptops táctiles
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
    const isLaptop = screenWidth >= 1024 || (screenWidth >= 768 && screenHeight >= 600);
    
    // Solo mostrar alerta si es claramente un teléfono móvil
    return (mobileRegex.test(userAgent) || (isPhone && isSmallScreen)) && !isTablet && !isLaptop;
}

// Función para mostrar la alerta de SweetAlert2
function showMobileAlert() {
    // Inyectar SweetAlert2 CSS personalizado
    const style = document.createElement('style');
    style.textContent = `
        .swal2-popup {
            font-family: 'Sofia Sans', sans-serif !important;
            border-radius: 15px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
        }
        
        .swal2-title {
            color: #d32f2f !important;
            font-weight: 800 !important;
            font-size: 1.5rem !important;
            margin-bottom: 10px !important;
        }
        
        .swal2-html-container {
            color: #333 !important;
            font-size: 1rem !important;
            line-height: 1.5 !important;
            margin: 15px 0 !important;
        }
        
        .swal2-icon.swal2-warning {
            border-color: #ff9800 !important;
            color: #ff9800 !important;
        }
        
        .swal2-confirm {
            background-color: #1976d2 !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            padding: 12px 30px !important;
            font-size: 1rem !important;
            transition: all 0.3s ease !important;
        }
        
        .swal2-confirm:hover {
            background-color: #1565c0 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 15px rgba(25, 118, 210, 0.4) !important;
        }
        
        .swal2-backdrop {
            background-color: rgba(0, 0, 0, 0.6) !important;
        }
        
        @media (max-width: 768px) {
            .swal2-popup {
                width: 90% !important;
                margin: 0 auto !important;
            }
            
            .swal2-title {
                font-size: 1.3rem !important;
            }
            
            .swal2-html-container {
                font-size: 0.9rem !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Mostrar la alerta
    Swal.fire({
        title: '⚠️ Dispositivo No Compatible',
        html: `
            <div style="text-align: left; padding: 10px;">
                <p><strong>Lo sentimos,</strong> este formulario está optimizado únicamente para:</p>
                <ul style="margin: 15px 0; padding-left: 20px;">
                    <li>💻 <strong>Computadores de escritorio</strong></li>
                    <li>💻 <strong>Laptops y portátiles</strong></li>
                </ul>
                <p>Para una mejor experiencia y funcionalidad completa, por favor accede desde un dispositivo con pantalla más grande.</p>
                <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                    <em>Gracias por tu comprensión.</em>
                </p>
            </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true,
        buttonsStyling: true,
        customClass: {
            popup: 'mobile-alert-popup',
            title: 'mobile-alert-title',
            htmlContainer: 'mobile-alert-content',
            confirmButton: 'mobile-alert-button'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Opcional: redirigir a otra página o cerrar la ventana
            // window.close(); // Solo funciona si la página fue abierta por JavaScript
            // window.location.href = 'https://tu-sitio-web.com/mobile-info';
            
            // Alternativamente, ocultar el contenido y mostrar un mensaje
            document.body.style.display = 'none';
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Sofia Sans', sans-serif;
                    color: white;
                    text-align: center;
                    padding: 20px;
                ">
                    <div>
                        <h1 style="font-size: 2rem; margin-bottom: 20px;">📱➡️💻</h1>
                        <h2 style="margin-bottom: 15px;">Acceso desde Computador Requerido</h2>
                        <p style="font-size: 1.1rem; opacity: 0.9;">
                            Por favor, visita esta página desde un computador o laptop.
                        </p>
                    </div>
                </div>
            `;
            document.body.style.display = 'block';
        }
    });
}

// Función principal que se ejecuta cuando se carga la página
function checkDeviceCompatibility() {
    if (isMobileDevice()) {
        // Esperar un poco para que SweetAlert2 se cargue completamente
        setTimeout(() => {
            showMobileAlert();
        }, 500);
    }
}

// Debug: Función para verificar qué está detectando (opcional - puedes eliminarla)
function debugDeviceInfo() {
    console.log('Device Debug Info:');
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen Width:', window.innerWidth);
    console.log('Screen Height:', window.innerHeight);
    console.log('Is Mobile:', isMobileDevice());
}

// Ejecutar la verificación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        debugDeviceInfo(); // Elimina esta línea en producción
        checkDeviceCompatibility();
    });
} else {
    debugDeviceInfo(); // Elimina esta línea en producción
    checkDeviceCompatibility();
}

// También verificar en caso de cambio de orientación o redimensionamiento
window.addEventListener('resize', () => {
    // Debounce para evitar múltiples llamadas
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        if (isMobileDevice() && !document.querySelector('.swal2-container')) {
            showMobileAlert();
        }
    }, 300);
});

// Verificar cuando cambia la orientación del dispositivo
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (isMobileDevice() && !document.querySelector('.swal2-container')) {
            showMobileAlert();
        }
    }, 500);
});