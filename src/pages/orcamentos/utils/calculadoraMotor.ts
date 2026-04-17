'use client';

// Lógica de cálculo extraída para fácil manutenção
import { ITemplateDTO, ITemplateCampoDTO, ITemplateSecaoDTO } from '@/shared/interfaces/template';

interface CalcParams {
    template: ITemplateDTO;
    respostas: Record<string, any>;
    largura: number;
    altura: number;
    quantidade: number;
    todosTemplates: ITemplateDTO[]; // Necessário para precificar Addons/Templates vinculados
    todasMateriasPrimas: any[]; // Necessário para buscar preço real da MP selecionada
}

export function calcularValorItem({ template, respostas, largura, altura, quantidade, todosTemplates, todasMateriasPrimas }: CalcParams): number {
    let valorUnitario = template.valorBaseVenda || 0;
    
    // Cálculo Base baseada na formula do Template
    let multiplicadorBase = 1;
    if (template.formulaCalculo === 'M2') {
        multiplicadorBase = largura * altura;
    } else if (template.formulaCalculo === 'ML') {
        // Padrão do mercado Comunicação Visual para tubo/metalon e perfis: Perímetro
        multiplicadorBase = (largura * 2) + (altura * 2);
    } else if (template.formulaCalculo === 'QTDE') {
        multiplicadorBase = 1; // A multiplicação final por "quantidade" no retorno já aplica a Qtde Específica para toda a árvore.
    }
    
    let totalBase = valorUnitario * multiplicadorBase;

    // Iterar pelas seções e verificar respostas
    let adicionais = 0;
    template.secoes.forEach(secao => {
        secao.campos.forEach(campo => {
            const resposta = respostas[campo.id];
            
            // Check de Condição de Visibilidade para não cobrar campos invisíveis
            if (!isCampoVisivel(campo, respostas, template)) return;
            
            const isEmbeddedTemplate = campo.tipoEntrada === 'TEMPLATE' && !!campo.templateId;

            if (resposta !== undefined || isEmbeddedTemplate) {
                // Cálculo de adicional dependente do tipo do Campo
                let multiplicadorCampo = 1;
                if (campo.tipoCalculo === 'M2') multiplicadorCampo = largura * altura;
                else if (campo.tipoCalculo === 'ML') multiplicadorCampo = (largura * 2) + (altura * 2);
                else if (campo.tipoCalculo === 'QTDE') multiplicadorCampo = quantidade;
                
                // Tipo Entrada = SIM_NAO
                if (campo.tipoEntrada === 'SIM_NAO' && resposta === 'SIM') {
                    adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo;
                }
                
                // Tipo Entrada = LISTA_OPCOES
                if (campo.tipoEntrada === 'LISTA_OPCOES') {
                    const opt = campo.opcoesLista?.find(o => o.nome === resposta);
                    if (opt) {
                        adicionais += (opt.valorAdicional || 0) * multiplicadorCampo;
                    }
                    if (campo.valorVendaAdicional) {
                         adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo;
                    }
                }

                // Tipo Entrada = SELECAO_GRUPO 
                if (campo.tipoEntrada === 'SELECAO_GRUPO') {
                     // Busca a matéria prima exata pelo nome que foi salvo na resposta
                     const mp = todasMateriasPrimas?.find(m => m.nome === resposta);
                     if (mp) {
                         adicionais += (mp.precoUnidade || 0) * multiplicadorCampo;
                     }
                     // Soma com alguma margem adicional de revenda configurada no campo, se houver
                     adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo;
                }
                
                // Tipo Entrada = TEMPLATE
                if (campo.tipoEntrada === 'TEMPLATE') {
                    if (campo.templateId) {
                        const childTpl = todosTemplates?.find(t => t.id === campo.templateId);
                        if (childTpl) {
                            let childValue = calcularValorItem({
                                template: childTpl,
                                respostas,
                                largura: largura,
                                altura: altura,
                                quantidade: 1, // we evaluate 1 unit of the child
                                todosTemplates,
                                todasMateriasPrimas
                            });
                            // The field's multiplicadorCampo applies to the entire child value!
                            adicionais += childValue * multiplicadorCampo;
                        }
                    } else {
                        // Procura o filho template selecionado (A resposta salva o ID dele)
                        const selectedTpl = todosTemplates?.find(t => t.id === resposta);
                        if (selectedTpl) {
                            let childMultiplier = 1;
                            if (selectedTpl.formulaCalculo === 'M2' && template.formulaCalculo === 'M2') {
                                 childMultiplier = largura * altura;
                            } else if (selectedTpl.formulaCalculo === 'ML' && template.formulaCalculo === 'ML') {
                                 childMultiplier = (largura * 2) + (altura * 2);
                            }
                            adicionais += (selectedTpl.valorBaseVenda || 0) * childMultiplier;
                        }
                        adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo; 
                    }
                }
                
                // ENTRADA_MANUAL (Ex: número)
                 if (campo.tipoEntrada === 'ENTRADA_MANUAL' && !isNaN(Number(resposta))) {
                     const valNumero = Number(resposta);
                     if (campo.tipoCalculo === 'QTDE') {
                         adicionais += (campo.valorVendaAdicional || 0) * valNumero;
                     } 
                 }
            }
        });
    });

    // Percorrer novamente para encontrar modificadores de "Multiplicação do Valor Total"
    let multiplicadorManualTotal = 1;
    template.secoes.forEach(secao => {
        secao.campos.forEach(campo => {
            const resposta = respostas[campo.id];
            if (!isCampoVisivel(campo, respostas, template)) return;
            
            if (resposta && campo.tipoEntrada === 'ENTRADA_MANUAL' && !isNaN(Number(resposta))) {
                if (campo.tipoCalculo === 'MULTIPLICA_TOTAL') {
                    multiplicadorManualTotal *= Number(resposta);
                }
            }
        });
    });

    return (totalBase + adicionais) * multiplicadorManualTotal * quantidade;
}

export interface CalcSecaoParams extends Omit<CalcParams, 'template'> {
    template: ITemplateDTO;
    secao: ITemplateSecaoDTO;
}

export function calcularValorSecao({ secao, template, respostas, largura, altura, quantidade, todosTemplates, todasMateriasPrimas }: CalcSecaoParams): number {
    let adicionais = 0;
    
    secao.campos.forEach(campo => {
        const resposta = respostas[campo.id];
        
        if (!isCampoVisivel(campo, respostas, template)) return;
        
        const isEmbeddedTemplate = campo.tipoEntrada === 'TEMPLATE' && !!campo.templateId;

        if (resposta !== undefined || isEmbeddedTemplate) {
            let multiplicadorCampo = 1;
            if (campo.tipoCalculo === 'M2') multiplicadorCampo = largura * altura;
            else if (campo.tipoCalculo === 'ML') multiplicadorCampo = (largura * 2) + (altura * 2);
            else if (campo.tipoCalculo === 'QTDE') multiplicadorCampo = quantidade;
            
            if (campo.tipoEntrada === 'SIM_NAO' && resposta === 'SIM') {
                adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo;
            }
            
            if (campo.tipoEntrada === 'LISTA_OPCOES') {
                const opt = campo.opcoesLista?.find(o => o.nome === resposta);
                if (opt) adicionais += (opt.valorAdicional || 0) * multiplicadorCampo;
                if (campo.valorVendaAdicional) adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo;
            }

            if (campo.tipoEntrada === 'SELECAO_GRUPO') {
                 const mp = todasMateriasPrimas?.find(m => m.nome === resposta);
                 if (mp) adicionais += (mp.precoUnidade || 0) * multiplicadorCampo;
                 adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo;
            }
            
            if (campo.tipoEntrada === 'TEMPLATE') {
                if (campo.templateId) {
                    const childTpl = todosTemplates?.find(t => t.id === campo.templateId);
                    if (childTpl) {
                        let childValue = calcularValorItem({
                            template: childTpl, respostas, largura, altura, quantidade: 1, todosTemplates, todasMateriasPrimas
                        });
                        adicionais += childValue * multiplicadorCampo;
                    }
                } else {
                    const selectedTpl = todosTemplates?.find(t => t.id === resposta);
                    if (selectedTpl) {
                        let childMultiplier = 1;
                        if (selectedTpl.formulaCalculo === 'M2' && template.formulaCalculo === 'M2') childMultiplier = largura * altura;
                        else if (selectedTpl.formulaCalculo === 'ML' && template.formulaCalculo === 'ML') childMultiplier = (largura * 2) + (altura * 2);
                        adicionais += (selectedTpl.valorBaseVenda || 0) * childMultiplier;
                    }
                    adicionais += (campo.valorVendaAdicional || 0) * multiplicadorCampo; 
                }
            }
            
             if (campo.tipoEntrada === 'ENTRADA_MANUAL' && !isNaN(Number(resposta))) {
                 const valNumero = Number(resposta);
                 if (campo.tipoCalculo === 'QTDE') adicionais += (campo.valorVendaAdicional || 0) * valNumero;
             }
        }
    });

    let multiplicadorManualTotal = 1;
    template.secoes.forEach(se => {
        se.campos.forEach(campo => {
            const resposta = respostas[campo.id];
            if (!isCampoVisivel(campo, respostas, template)) return;
            if (resposta && campo.tipoEntrada === 'ENTRADA_MANUAL' && !isNaN(Number(resposta))) {
                if (campo.tipoCalculo === 'MULTIPLICA_TOTAL') multiplicadorManualTotal *= Number(resposta);
            }
        });
    });

    return adicionais * multiplicadorManualTotal * quantidade;
}

export function isCampoVisivel(campo: ITemplateCampoDTO, respostas: Record<string, any>, template: ITemplateDTO): boolean {
    if (!campo.condicaoVisibilidade || !campo.condicaoVisibilidade.campoReferencia || !campo.condicaoVisibilidade.valorEsperado) {
        return true;
    }
    
    // Procura o id do campo de referencia baseado no Titulo (que foi como salvamos)
    let campoRefId = '';
    template.secoes.forEach(s => {
        s.campos.forEach(c => {
            if (c.titulo === campo.condicaoVisibilidade?.campoReferencia) {
                campoRefId = c.id;
            }
        });
    });

    if (!campoRefId || campoRefId === campo.id) return true; // Falha segura: mostra se não achar a ref ou for ele mesmo
    
    const respRef = respostas[campoRefId];
    return String(respRef) === String(campo.condicaoVisibilidade.valorEsperado);
}
