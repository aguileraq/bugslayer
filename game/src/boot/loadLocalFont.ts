import { BootFontError } from './BootController';

export interface LocalFontDefinition {
  readonly family: string;
  readonly url: string;
}

export async function loadLocalFont(
  definition: LocalFontDefinition,
): Promise<void> {
  if (typeof FontFace === 'undefined' || document.fonts === undefined) {
    throw new BootFontError(
      `Font Loading API is unavailable for "${definition.family}".`,
    );
  }

  try {
    const face = new FontFace(
      definition.family,
      `url("${definition.url}") format("woff2")`,
      { display: 'block' },
    );
    const loadedFace = await face.load();
    document.fonts.add(loadedFace);
    await document.fonts.load(`16px "${definition.family}"`);
    if (!document.fonts.check(`16px "${definition.family}"`)) {
      throw new Error('The browser did not report the font as available.');
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown font error.';
    throw new BootFontError(
      `Could not load local font "${definition.family}": ${detail}`,
    );
  }
}
