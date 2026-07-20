// lib/parser/templateParser.ts
// Template parser with AST validation and round-trip verification

import Handlebars from 'handlebars';

/**
 * Result of parsing a Handlebars template
 */
export interface ParseResult {
  ast: any; // Handlebars AST object
  valid: boolean;
  errors: string[];
}

/**
 * Result of round-trip validation (parse → print → parse equivalence)
 */
export interface RoundTripResult {
  success: boolean;
  originalAst: any;
  roundTripAst: any;
  differences: string[];
}

/**
 * Parse a Handlebars template string into an Abstract Syntax Tree (AST)
 * 
 * @param templateHtml - The Handlebars template string to parse
 * @returns ParseResult with AST, valid flag, and error messages
 * 
 * **Validates: Requirements 8.1, 8.2, 8.3**
 */
export function parseTemplate(templateHtml: string): ParseResult {
  const errors: string[] = [];

  // Validate input
  if (!templateHtml || typeof templateHtml !== 'string') {
    errors.push('Template must be a non-empty string');
    return {
      ast: null,
      valid: false,
      errors,
    };
  }

  try {
    // Use Handlebars.parse() to generate AST
    const ast = Handlebars.parse(templateHtml);
    
    return {
      ast,
      valid: true,
      errors: [],
    };
  } catch (e: any) {
    // Catch Handlebars parse errors with detailed message
    const errorMessage = e.message || 'Unknown parsing error';
    const location = e.loc ? ` at line ${e.loc.start.line}, column ${e.loc.start.column}` : '';
    errors.push(`Invalid Handlebars syntax${location}: ${errorMessage}`);
    
    return {
      ast: null,
      valid: false,
      errors,
    };
  }
}

/**
 * Pretty-print an AST back into a valid Handlebars template string
 * 
 * Converts the Handlebars AST back to template syntax while:
 * - Normalizing helper call syntax to standard format
 * - Preserving significant whitespace and structure
 * - Maintaining semantic equivalence
 * 
 * @param ast - The Handlebars AST to pretty-print
 * @returns A valid Handlebars template string
 * 
 * **Validates: Requirements 8.4, 8.6, 8.7**
 */
export function prettyPrintTemplate(ast: any): string {
  if (!ast) {
    return '';
  }

  // For Handlebars AST, we use a visitor pattern to reconstruct the template
  return printAst(ast);
}

/**
 * Internal helper function to recursively print AST nodes
 */
function printAst(node: any, depth: number = 0): string {
  if (!node) {
    return '';
  }

  // Handle Program node (root)
  if (node.type === 'Program') {
    const body = node.body
      .map((n: any) => printAst(n, depth))
      .join('');
    return body;
  }

  // Handle text nodes
  if (node.type === 'ContentStatement') {
    return node.value;
  }

  // Handle mustache expressions (variables)
  if (node.type === 'MustacheStatement') {
    const path = printPath(node.path);
    const params = node.params?.length
      ? ' ' + node.params.map((p: any) => printPath(p)).join(' ')
      : '';
    const hash = node.hash && Object.keys(node.hash.pairs).length
      ? ' ' + node.hash.pairs.map((pair: any) => `${pair.key}=${printPath(pair.value)}`).join(' ')
      : '';
    return `{{${path}${params}${hash}}}`;
  }

  // Handle block statements (if, each, etc.)
  if (node.type === 'BlockStatement') {
    const opening = `{{#${printPath(node.path)}`;
    const params = node.params?.length
      ? ' ' + node.params.map((p: any) => printPath(p)).join(' ')
      : '';
    const hash = node.hash && Object.keys(node.hash.pairs).length
      ? ' ' + node.hash.pairs.map((pair: any) => `${pair.key}=${printPath(pair.value)}`).join(' ')
      : '';
    const openTag = opening + params + hash + '}}';
    
    const blockBody = node.program?.body
      ?.map((n: any) => printAst(n, depth + 1))
      ?.join('') || '';

    const inverseBody = node.inverse?.body
      ?.map((n: any) => printAst(n, depth + 1))
      ?.join('') || '';
    
    const inverse = inverseBody ? `{{else}}${inverseBody}` : '';
    
    const closing = `{{/${printPath(node.path)}}}`;

    return `${openTag}${blockBody}${inverse}${closing}`;
  }

  // Handle partial statements
  if (node.type === 'PartialStatement') {
    const path = printPath(node.name);
    const params = node.params?.length
      ? ' ' + node.params.map((p: any) => printPath(p)).join(' ')
      : '';
    const hash = node.hash && Object.keys(node.hash.pairs).length
      ? ' ' + node.hash.pairs.map((pair: any) => `${pair.key}=${printPath(pair.value)}`).join(' ')
      : '';
    return `{{>${path}${params}${hash}}}`;
  }

  // Handle decorators
  if (node.type === 'DecoratorStatement') {
    const path = printPath(node.path);
    const params = node.params?.length
      ? ' ' + node.params.map((p: any) => printPath(p)).join(' ')
      : '';
    const hash = node.hash && Object.keys(node.hash.pairs).length
      ? ' ' + node.hash.pairs.map((pair: any) => `${pair.key}=${printPath(pair.value)}`).join(' ')
      : '';
    return `{{*${path}${params}${hash}}}`;
  }

  // Handle comments
  if (node.type === 'CommentStatement') {
    return `{{!--${node.value}--}}`;
  }

  // Default: return empty string for unknown node types
  return '';
}

/**
 * Convert a path node to string representation
 */
function printPath(node: any): string {
  if (!node) return '';

  if (node.type === 'PathExpression') {
    const parts = node.parts || [];
    const prefix = node.original?.[0] === '.' ? '.' : '';
    const segments = parts.length > 0 ? parts.join('.') : (node.original || '');
    return prefix + segments;
  }

  if (node.type === 'StringLiteral') {
    return `"${node.original}"`;
  }

  if (node.type === 'BooleanLiteral') {
    return node.original;
  }

  if (node.type === 'NumberLiteral') {
    return node.original;
  }

  if (node.type === 'UndefinedLiteral') {
    return 'undefined';
  }

  if (node.type === 'NullLiteral') {
    return 'null';
  }

  // For other path-like nodes, try original or fallback
  return node.original || '';
}

/**
 * Validate round-trip conversion: parse → print → parse should produce equivalent AST
 * 
 * This ensures that template integrity is preserved through editing cycles.
 * For any valid template, parsing it, pretty-printing to string, and parsing again
 * should produce an AST equivalent to the original parse.
 * 
 * @param templateHtml - The original Handlebars template string
 * @returns RoundTripResult with success flag and AST comparison
 * 
 * **Validates: Requirements 8.5, 8.8**
 */
export function validateRoundTrip(templateHtml: string): RoundTripResult {
  // Step 1: Parse original template
  const parseResult1 = parseTemplate(templateHtml);
  
  if (!parseResult1.valid || !parseResult1.ast) {
    return {
      success: false,
      originalAst: null,
      roundTripAst: null,
      differences: [`Original template failed to parse: ${parseResult1.errors.join(', ')}`],
    };
  }

  // Step 2: Pretty-print AST back to string
  const printedTemplate = prettyPrintTemplate(parseResult1.ast);

  // Step 3: Parse the printed template again
  const parseResult2 = parseTemplate(printedTemplate);

  if (!parseResult2.valid || !parseResult2.ast) {
    return {
      success: false,
      originalAst: parseResult1.ast,
      roundTripAst: null,
      differences: [
        `Round-trip template failed to parse: ${parseResult2.errors.join(', ')}`,
        `Original template: ${templateHtml}`,
        `Printed template: ${printedTemplate}`,
      ],
    };
  }

  // Step 4: Compare ASTs for equivalence
  const differences = compareAsts(parseResult1.ast, parseResult2.ast);

  return {
    success: differences.length === 0,
    originalAst: parseResult1.ast,
    roundTripAst: parseResult2.ast,
    differences,
  };
}

/**
 * Compare two ASTs for equivalence
 * 
 * Returns array of difference descriptions if ASTs are not equivalent,
 * empty array if they are equivalent
 */
function compareAsts(ast1: any, ast2: any, path: string = 'root'): string[] {
  const differences: string[] = [];

  // Type mismatch
  if (!ast1 || !ast2) {
    if (ast1 !== ast2) {
      differences.push(`Type mismatch at ${path}: ${typeof ast1} vs ${typeof ast2}`);
    }
    return differences;
  }

  if (ast1.type !== ast2.type) {
    differences.push(`Node type mismatch at ${path}: ${ast1.type} vs ${ast2.type}`);
    return differences;
  }

  // For Program nodes, compare body array
  if (ast1.type === 'Program') {
    if (!Array.isArray(ast1.body) || !Array.isArray(ast2.body)) {
      differences.push(`Body is not array at ${path}`);
      return differences;
    }

    if (ast1.body.length !== ast2.body.length) {
      differences.push(
        `Body length mismatch at ${path}: ${ast1.body.length} vs ${ast2.body.length}`
      );
    }

    const maxLen = Math.max(ast1.body.length, ast2.body.length);
    for (let i = 0; i < maxLen; i++) {
      differences.push(
        ...compareAsts(ast1.body[i] || {}, ast2.body[i] || {}, `${path}.body[${i}]`)
      );
    }
  }

  // For nodes with value property (ContentStatement, CommentStatement)
  if ('value' in ast1 && 'value' in ast2) {
    if (ast1.value !== ast2.value) {
      differences.push(`Value mismatch at ${path}: "${ast1.value}" vs "${ast2.value}"`);
    }
  }

  // For nodes with path
  if ('path' in ast1 && 'path' in ast2) {
    differences.push(...compareAsts(ast1.path, ast2.path, `${path}.path`));
  }

  // For nodes with program/inverse
  if ('program' in ast1 || 'program' in ast2) {
    differences.push(...compareAsts(ast1.program || {}, ast2.program || {}, `${path}.program`));
  }

  if ('inverse' in ast1 || 'inverse' in ast2) {
    differences.push(...compareAsts(ast1.inverse || {}, ast2.inverse || {}, `${path}.inverse`));
  }

  // For nodes with params
  if ('params' in ast1 || 'params' in ast2) {
    const params1 = ast1.params || [];
    const params2 = ast2.params || [];
    
    if (params1.length !== params2.length) {
      differences.push(`Params length mismatch at ${path}: ${params1.length} vs ${params2.length}`);
    }

    const maxLen = Math.max(params1.length, params2.length);
    for (let i = 0; i < maxLen; i++) {
      differences.push(...compareAsts(params1[i] || {}, params2[i] || {}, `${path}.params[${i}]`));
    }
  }

  // For nodes with hash
  if ('hash' in ast1 || 'hash' in ast2) {
    const hash1 = ast1.hash || { pairs: [] };
    const hash2 = ast2.hash || { pairs: [] };

    if (hash1.pairs?.length !== hash2.pairs?.length) {
      differences.push(
        `Hash length mismatch at ${path}: ${hash1.pairs?.length || 0} vs ${hash2.pairs?.length || 0}`
      );
    }
  }

  // For PathExpression nodes
  if (ast1.type === 'PathExpression') {
    const parts1 = (ast1.parts || []).join('.');
    const parts2 = (ast2.parts || []).join('.');
    
    if (parts1 !== parts2) {
      differences.push(`PathExpression mismatch at ${path}: ${parts1} vs ${parts2}`);
    }
  }

  // For StringLiteral, NumberLiteral, BooleanLiteral nodes
  if (['StringLiteral', 'NumberLiteral', 'BooleanLiteral'].includes(ast1.type)) {
    if (ast1.value !== ast2.value) {
      differences.push(
        `${ast1.type} value mismatch at ${path}: ${ast1.value} vs ${ast2.value}`
      );
    }
  }

  return differences;
}

/**
 * Extract all variable references from a Handlebars template
 * 
 * Returns array of unique variable names used in the template
 * (Useful for requirements analysis and variable mapping)
 */
export function extractVariableReferences(templateHtml: string): string[] {
  const parseResult = parseTemplate(templateHtml);
  
  if (!parseResult.valid || !parseResult.ast) {
    return [];
  }

  const variables = new Set<string>();
  extractVariablesFromAst(parseResult.ast, variables);
  
  return Array.from(variables).sort();
}

/**
 * Recursively extract variable names from AST
 */
function extractVariablesFromAst(node: any, variables: Set<string>): void {
  if (!node) return;

  // Handle PathExpression - represents variable references
  if (node.type === 'PathExpression' && node.parts) {
    // Add the first part of the path (the variable name)
    if (node.parts.length > 0) {
      variables.add(node.parts[0]);
    }
  }

  // Recursively process child nodes
  if (node.body && Array.isArray(node.body)) {
    node.body.forEach((child: any) => extractVariablesFromAst(child, variables));
  }

  if (node.program) {
    extractVariablesFromAst(node.program, variables);
  }

  if (node.inverse) {
    extractVariablesFromAst(node.inverse, variables);
  }

  if (node.path) {
    extractVariablesFromAst(node.path, variables);
  }

  if (node.params && Array.isArray(node.params)) {
    node.params.forEach((param: any) => extractVariablesFromAst(param, variables));
  }

  if (node.hash?.pairs && Array.isArray(node.hash.pairs)) {
    node.hash.pairs.forEach((pair: any) => {
      extractVariablesFromAst(pair.value, variables);
    });
  }
}
