/**
 * Barrel de exports da camada de serviços Supabase.
 *
 * @example
 * import { orcamentoService, clienteService } from '@/shared/services';
 */

export { authService, usuarioService }                           from './authService';
export { clienteService }                                        from './clienteService';
export { materiaPrimaService, categoriaMateriaPrimaService }     from './materiaPrimaService';
export { templateService }                                       from './templateService';
export { orcamentoService }                                      from './orcamentoService';
export { statusOrcamentoService, tipoFollowupService }           from './configuracaoFunilService';
export { configuracaoEmpresaService }                            from './configuracaoEmpresaService';
