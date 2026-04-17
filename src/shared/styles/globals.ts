import 'styled-components';
import { createGlobalStyle } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends IThemeProvider {}
}

export type ICustomTheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export interface IThemeProvider {
  // Primária
  primary900: string; // #004925 - Mais escuro
  primary800: string; // #006232
  primary700: string; // #007A3E
  primary600: string; // #008F48
  primary500: string; // #00A650 - Base
  primary400: string; // #33B874
  primary300: string; // #66CA98
  primary200: string; // #7AF2B6
  primary100: string; // #8FFFD5 - Mais claro

  // Secundária (Amarelo)
  secundary700: string; // #BFB000
  secundary600: string; // #D9C600
  secundary500: string; // #FFF200 - Base
  secundary400: string; // #FFF533
  secundary300: string; // #FFF866

  // Escala de Cinza
  gray900: string; // #4F4F4F - Texto principal
  gray800: string; // #696969
  gray700: string; // #858585
  gray600: string; // #999999
  gray500: string; // #ADADAD
  gray400: string; // #C2C2C2
  gray300: string; // #D1D1D1
  gray200: string; // #E6E6E6
  gray150: string; // #F0F0F0
  gray100: string; // #FAFAFA - Fundo

  // Estados
  success: string; // Verde
  danger: string; // Vermelho
  warning: string; // Laranja
  info: string; // Azul

  background: string; // Cor de fundo
  container: string; // Cor de container
}

export const defaultTheme: IThemeProvider = {
  primary900: '#004925',
  primary800: '#006232',
  primary700: '#007A3E',
  primary600: '#008F48',
  primary500: '#00A650',
  primary400: '#33B874',
  primary300: '#66CA98',
  primary200: '#7AF2B6',
  primary100: '#8FFFD5',

  secundary700: '#B26E00',
  secundary600: '#D98600',
  secundary500: '#F59E0B',
  secundary400: '#FBBF24',
  secundary300: '#FCD34D',

  gray900: '#4F4F4F',
  gray800: '#696969',
  gray700: '#858585',
  gray600: '#999999',
  gray500: '#ADADAD',
  gray400: '#C2C2C2',
  gray300: '#D1D1D1',
  gray200: '#E6E6E6',
  gray150: '#F0F0F0',
  gray100: '#FAFAFA',

  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  background: '#F0F0F0',
  container: '#FFFFFF',
};

export const darkTheme: IThemeProvider = {
  ...defaultTheme,
  background: '#1A1A1A',
  container: '#2D2D2D',
  gray900: '#FAFAFA',
  gray800: '#F0F0F0',
  gray100: '#4F4F4F',
};

export function handleColorType(colorType: ICustomTheme, isDark: boolean = false): string {
  const theme = isDark ? darkTheme : defaultTheme;
  const colorMap: Record<ICustomTheme, string> = {
    primary: theme.primary500,
    secondary: theme.secundary500,
    success: theme.success,
    danger: theme.danger,
    warning: theme.warning,
    info: theme.info,
    light: theme.gray100, // Claro ou escuro baseado no tema (cruzado)
    dark: theme.gray900,
  };
  return colorMap[colorType];
}

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.gray900};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
