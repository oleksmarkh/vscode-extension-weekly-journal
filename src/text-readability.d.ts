declare module 'text-readability' {
  export function lexiconCount(text: string, removePunctuation: boolean): number
  export function textStandard(text: string, floatOutput: boolean): string
}
