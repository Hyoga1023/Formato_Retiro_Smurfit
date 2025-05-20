document.addEventListener('DOMContentLoaded', () => {
    const botonPDF = document.getElementById('boton-pdf');

    if (botonPDF) {
        botonPDF.addEventListener('click', async () => {
            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'pt', 'a4');

                const contenedor = document.createElement('div');
                contenedor.className = 'pdf-container';

                const headerClone = document.querySelector('header').cloneNode(true);
                const mainClone = document.querySelector('main').cloneNode(true);

                // Preparar observaciones
                const observaciones = mainClone.querySelector('.desborde');
                if (observaciones) {
                    observaciones.style.display = 'block';
                    observaciones.style.visibility = 'visible';
                    observaciones.style.opacity = '1';
                    observaciones.style.marginBottom = '50px';
                    observaciones.style.paddingBottom = '30px';
                }

                // Ocultar botón
                const botonClone = mainClone.querySelector('.botón_container');
                if (botonClone) {
                    botonClone.style.display = 'none';
                }

                // Ajustar selects
                const selects = headerClone.querySelectorAll('select');
                selects.forEach(select => {
                    select.style.height = 'auto';
                    select.style.minHeight = '35px';
                    select.style.overflow = 'visible';
                    select.style.position = 'relative';
                });

                // Función para ajustar títulos
                const ajustarTitulos = (element) => {
                    const titulos = element.querySelectorAll('.titulo_info_basica, .titulo_tipo_retiro, .titulo_info_transaccional, .titulo_forma_retiro, .titulo_beneficiario, .titulo_firmas');
                    titulos.forEach(titulo => {
                        titulo.style.display = 'flex';
                        titulo.style.alignItems = 'center';
                        titulo.style.justifyContent = 'center';
                        titulo.style.minHeight = '35px';
                        titulo.style.padding = '5px 0';
                        titulo.style.whiteSpace = 'pre-wrap';
                        titulo.style.wordSpacing = '0.2em';
                        titulo.style.letterSpacing = '0.01em';
                        titulo.style.borderBottom = '3px solid black';
                    });
                };

                ajustarTitulos(headerClone);
                ajustarTitulos(mainClone);

                contenedor.appendChild(headerClone);
                contenedor.appendChild(mainClone);
                document.body.appendChild(contenedor);

             
                const canvas = await html2canvas(contenedor, {
                    scale: 1.0, 
                    useCORS: true,
                    logging: false,
                    imageTimeout: 0, 
                    windowWidth: contenedor.scrollWidth,
                    windowHeight: contenedor.scrollHeight,
                    onclone: function(clonedDoc) {
                        const clonedSelects = clonedDoc.querySelectorAll('select');
                        clonedSelects.forEach(select => {
                            const selectedOption = select.options[select.selectedIndex];
                            const textNode = clonedDoc.createElement('div');
                            textNode.textContent = selectedOption ? selectedOption.text : '';
                            textNode.style.border = '1px solid #ccc';
                            textNode.style.padding = '5px 8px';
                            textNode.style.width = '100%';
                            textNode.style.boxSizing = 'border-box';
                            textNode.style.fontFamily = "'Sofia Sans', sans-serif";
                            textNode.style.fontSize = '1rem';
                            textNode.style.height = 'auto';
                            select.parentNode.replaceChild(textNode, select);
                        });

                        const titulos = clonedDoc.querySelectorAll('.titulo_info_basica, .titulo_tipo_retiro, .titulo_info_transaccional, .titulo_forma_retiro, .titulo_beneficiario, .titulo_firmas');
                        titulos.forEach(titulo => {
                            titulo.style.whiteSpace = 'pre-wrap';
                            titulo.style.wordSpacing = '0.2em';
                            titulo.style.letterSpacing = '0.005em';
                        });

                        // OPTIMIZACIÓN 2: Eliminar o simplificar elementos innecesarios
                     
                        const elementosDecorativosPesados = clonedDoc.querySelectorAll('.decorativo, .imagen-decorativa');
                        elementosDecorativosPesados.forEach(elem => {
                            elem.style.display = 'none';
                        });
                        
                        // Simplificar sombras y efectos CSS
                        const elementosConEfectos = clonedDoc.querySelectorAll('*');
                        elementosConEfectos.forEach(elem => {
                            elem.style.boxShadow = 'none';
                            elem.style.textShadow = 'none';
                            elem.style.filter = 'none';
                        });
                    }
                });

                document.body.removeChild(contenedor);

                // OPTIMIZACIÓN 3: Configurar la compresión de imagen en jsPDF
                const imagenData = canvas.toDataURL('image/jpeg', 0.95);

                const margenLateral = 10;
                const margenSuperior = 7;
                const margenInferior = 7;

                const pdfWidth = pdf.internal.pageSize.getWidth() - (margenLateral * 2);
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const pdfPageHeight = pdf.internal.pageSize.getHeight();

                if (pdfHeight + margenSuperior + margenInferior > pdfPageHeight) {
                    const escalaAjustada = (pdfPageHeight - margenSuperior - margenInferior) / pdfHeight;
                    const nuevoAncho = pdfWidth * escalaAjustada;
                    const nuevoAlto = pdfHeight * escalaAjustada;

                    pdf.addImage(
                        imagenData,
                        'JPEG', // Cambiado de PNG a JPEG
                        (pdf.internal.pageSize.getWidth() - nuevoAncho) / 2,
                        margenSuperior,
                        nuevoAncho,
                        nuevoAlto
                    );
                } else {
                    pdf.addImage(
                        imagenData,
                        'JPEG', // Cambiado de PNG a JPEG
                        margenLateral,
                        margenSuperior,
                        pdfWidth,
                        pdfHeight
                    );
                }

                // OPTIMIZACIÓN 4: Configurar la compresión del PDF
                const pdfOptions = {
                    compress: true,
                    precision: 2
                };
                
                pdf.save('Formato de Retiro.pdf', pdfOptions);
            } catch (error) {
                console.error("Error:", error);
                alert("Error al generar PDF. Consulte la consola.");
            }
        });
    }
});

document.getElementById('monto_retiro').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = new Intl.NumberFormat('es-MX').format(value);
});

/*************************modificación campos input*************** */
document.addEventListener('DOMContentLoaded', function() {
  // 1. Implementación para alternar entre "MÁXIMO DISPONIBLE" y "VALOR A RETIRAR"
  const checkboxMaximo = document.getElementById('maximo_disponible');
  const inputMontoRetiro = document.getElementById('monto_retiro');

  // Función para manejar la interacción entre checkbox y campo de monto
  function toggleMontoRetiro() {
    if (checkboxMaximo.checked) {
      inputMontoRetiro.disabled = true;
      inputMontoRetiro.value = '';
      inputMontoRetiro.parentElement.classList.add('disabled');
    } else {
      inputMontoRetiro.disabled = false;
      inputMontoRetiro.parentElement.classList.remove('disabled');
    }
  }

  // Asignar evento al checkbox
  checkboxMaximo.addEventListener('change', toggleMontoRetiro);


  inputMontoRetiro.addEventListener('input', function() {
    if (inputMontoRetiro.value.trim() !== '') {
      checkboxMaximo.checked = false;
    }
  });

  // 2. Validación de campos (números y texto)
  
  // Campos que solo deben aceptar números
  const camposNumericos = [
    'num_documento',
    'telefono',
    'monto_retiro',
    'beneficiario_num_doc',
    'beneficiario_num_cuenta'
  ];

  // Campos que solo deben aceptar letras y convertir a mayúsculas
  const camposTexto = [
    'nombre',
    'beneficiario_nombre',
    'entidad_bancaria'
  ];

  // Validar campos numéricos
  camposNumericos.forEach(function(id) {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', function(e) {
        // Reemplazar cualquier caracter que no sea número
        let valor = e.target.value.replace(/[^0-9]/g, '');
        
        // Para el campo de monto, permitir formato de miles con comas
        if (id === 'monto_retiro') {
          // Eliminar comas existentes primero
          valor = valor.replace(/,/g, '');
          
          // Formatear con comas para miles
          if (valor.length > 0) {
            valor = new Intl.NumberFormat('es-CO').format(parseInt(valor));
          }
        }
        
        e.target.value = valor;
      });
    }
  });

  // Validar campos de texto y convertir a mayúsculas
  camposTexto.forEach(function(id) {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', function(e) {
        // Reemplazar números por nada
        let valor = e.target.value.replace(/[0-9]/g, '');
        
        // Convertir a mayúsculas
        valor = valor.toUpperCase();
        
        e.target.value = valor;
      });
    }
  });

  // Aplicar validación a la textarea de patrocinadora (solo texto y mayúsculas)
  const textareaPatrocinadora = document.querySelector('.patrocinadora-input');
  if (textareaPatrocinadora) {
    textareaPatrocinadora.addEventListener('input', function(e) {
      // Convertir a mayúsculas
      let valor = e.target.value.toUpperCase();
      e.target.value = valor;
    });
  }

  // Para el correo electrónico, permitir combinación de caracteres pero mantener minúsculas
  const campoCorreo = document.getElementById('correo');
  if (campoCorreo) {
    campoCorreo.addEventListener('input', function(e) {
      // No se aplica ninguna transformación específica al correo
    });
  }

  // Inicializar el estado del campo de monto al cargar la página
  toggleMontoRetiro();

  const style = document.createElement('style');
  style.textContent = `
    .input-currency.disabled {
      opacity: 0.6;
      background-color: #f0f0f0;
    }
  `;
  document.head.appendChild(style);
});