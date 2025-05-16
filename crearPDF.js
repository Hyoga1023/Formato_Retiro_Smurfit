document.addEventListener('DOMContentLoaded', () => {
    const botonPDF = document.getElementById('boton-pdf');

    if (botonPDF) {
        botonPDF.addEventListener('click', async () => {
            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'pt', 'a4');
                
                // 1. Clonamos el contenido completo
                const contenedor = document.createElement('div');
                contenedor.className = 'pdf-container';
                
                // Clonamos todo excepto el footer y el botón
                const headerClone = document.querySelector('header').cloneNode(true);
                const mainClone = document.querySelector('main').cloneNode(true);
                
                // Aseguramos que "Observaciones:" sea visible
                const observaciones = mainClone.querySelector('.desborde');
                if (observaciones) {
                    observaciones.style.display = 'block';
                    observaciones.style.visibility = 'visible';
                    observaciones.style.opacity = '1';
                    // Añadimos más padding/margen para asegurar que sea visible
                    observaciones.style.marginBottom = '50px';
                    observaciones.style.paddingBottom = '30px';
                }
                
                // Ocultamos solo el botón
                const botonClone = mainClone.querySelector('.botón_container');
                if (botonClone) {
                    botonClone.style.display = 'none';
                }
                
                // Ajustamos la visualización de los select (tipo de ID y tipo de documento)
                const selectTipoDocumento = headerClone.querySelector('#tipo_documento');
                const selectTipoID = headerClone.querySelector('#beneficiario_tipo_id');
                
                // Forzamos la visualización correcta de los select
                if (selectTipoDocumento) {
                    selectTipoDocumento.style.height = 'auto';
                    selectTipoDocumento.style.minHeight = '30px';
                    selectTipoDocumento.style.overflow = 'visible';
                    selectTipoDocumento.style.position = 'relative';
                }
                
                if (selectTipoID) {
                    selectTipoID.style.height = 'auto';
                    selectTipoID.style.minHeight = '30px';
                    selectTipoID.style.overflow = 'visible';
                    selectTipoID.style.position = 'relative';
                }
                
                // Aseguramos que todos los select sean visibles correctamente
                const allSelects = headerClone.querySelectorAll('select');
                allSelects.forEach(select => {
                    select.style.height = 'auto';
                    select.style.minHeight = '30px';
                    select.style.overflow = 'visible';
                    select.style.position = 'relative';
                    select.style.zIndex = '1';
                });
                
                // Corregimos el posicionamiento de los títulos
                const ajustarTitulos = (element) => {
                    const titulos = element.querySelectorAll('.titulo_info_basica, .titulo_tipo_retiro, .titulo_info_transaccional, .titulo_forma_retiro, .titulo_beneficiario, .titulo_firmas');
                    
                    titulos.forEach(titulo => {
                        // Centramos verticalmente los títulos
                        titulo.style.display = 'flex';
                        titulo.style.alignItems = 'center'; 
                        titulo.style.justifyContent = 'center';
                        titulo.style.height = 'auto';
                        titulo.style.minHeight = '35px'; // Altura mínima para los títulos
                        titulo.style.padding = '5px 0';  // Padding vertical
                        titulo.style.position = 'relative'; // Asegura que se posicione correctamente
                        titulo.style.top = '0'; // Evita desplazamientos no deseados
                        titulo.style.borderBottom = '3px solid black'; // Mantiene el borde inferior consistente
                    });

                    // También ajustamos subtítulos y encabezados de sección
                    const sectionTitles = element.querySelectorAll('.section-title');
                    sectionTitles.forEach(title => {
                        title.style.display = 'flex';
                        title.style.alignItems = 'center';
                        title.style.justifyContent = 'center';
                        title.style.minHeight = '30px';
                        title.style.padding = '5px 0';
                    });
                };
                
                // Aplicamos ajustes a los títulos tanto en header como en main
                ajustarTitulos(headerClone);
                ajustarTitulos(mainClone);
                
                contenedor.appendChild(headerClone);
                contenedor.appendChild(mainClone);
                document.body.appendChild(contenedor);

                // 2. Configuración de html2canvas
                const canvas = await html2canvas(contenedor, {
                    scale: 1.5,
                    useCORS: true,
                    windowWidth: contenedor.scrollWidth,
                    windowHeight: contenedor.scrollHeight,
                    logging: true,
                    onclone: function(clonedDoc) {
                        // Manipulación adicional del DOM clonado justo antes de renderizar
                        const selects = clonedDoc.querySelectorAll('select');
                        selects.forEach(select => {
                            // Reemplazo de los select por un div con el texto del valor seleccionado
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
                        
                        // Aplicar nuevamente los ajustes a los títulos para asegurar que se mantengan
                        const titulos = clonedDoc.querySelectorAll('.titulo_info_basica, .titulo_tipo_retiro, .titulo_info_transaccional, .titulo_forma_retiro, .titulo_beneficiario, .titulo_firmas');
                        titulos.forEach(titulo => {
                            titulo.style.display = 'flex';
                            titulo.style.alignItems = 'center';
                            titulo.style.justifyContent = 'center';
                            titulo.style.minHeight = '35px';
                            titulo.style.padding = '5px 0';
                        });
                    }
                });

                // 3. Limpieza
                document.body.removeChild(contenedor);

                // 4. Ajuste de márgenes (reducidos en todos los costados)
                const margenLateral = 10; // Reducido de 28.35 (1cm) a 20 puntos
                const margenSuperior = 7;   // Reducido de 15 a 10 puntos
                const margenInferior = 7;   // Reducido de 40 a 25 puntos
                
                const pdfWidth = pdf.internal.pageSize.getWidth() - (margenLateral * 2);
                
                // Calculamos el alto manteniendo el aspecto pero dejando margen inferior
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const pdfPageHeight = pdf.internal.pageSize.getHeight();
                
                // Verificamos si el contenido cabe en la página con el margen inferior
                if (pdfHeight + margenSuperior + margenInferior > pdfPageHeight) {
                    // Si no cabe, ajustamos la escala para que quepa
                    const escalaAjustada = (pdfPageHeight - margenSuperior - margenInferior) / pdfHeight;
                    const nuevoAncho = pdfWidth * escalaAjustada;
                    const nuevoAlto = pdfHeight * escalaAjustada;
                    
                    pdf.addImage(
                        canvas.toDataURL('image/png'), 
                        'PNG',
                        (pdf.internal.pageSize.getWidth() - nuevoAncho) / 2, // Centramos horizontalmente
                        margenSuperior,
                        nuevoAncho,
                        nuevoAlto
                    );
                } else {
                    // Si cabe, usamos los valores originales
                    pdf.addImage(
                        canvas.toDataURL('image/png'), 
                        'PNG',
                        margenLateral,
                        margenSuperior,
                        pdfWidth,
                        pdfHeight
                    );
                }
                
                pdf.save('Formato de Retiro.pdf');
                
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
