export interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string;
  href: string;
}

export type ToolCategory = 
  | 'encoders'
  | 'formatters'
  | 'generators'
  | 'converters'
  | 'text'
  | 'utilities'
  | 'pdf';

export interface LocaleSwitcherProps {
  locale: string;
}

export interface ThemeToggleProps {
  className?: string;
}

export interface ToolCardProps {
  tool: Tool;
}

export interface HeaderProps {
  locale: string;
}
