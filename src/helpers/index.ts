/**
 * Get class name
 * Returns element class based on input in BEM manner
 *
 * @param baseName {string}
 * @param element {string}
 * @param modifier {string}
 * @return string
 */
export function getClassName(
    baseName: string,
    element?: string | null,
    modifier?: string,
): string {
    let className = baseName;

    if (element) {
        className = `${className}__${element}`;
    }
    if (modifier) {
        className = `${className}--${modifier}`;
    }

    return className;
}

/**
 * Generate object with element classes
 * based on main class name and element name
 *
 * @param className
 * @param elementNames
 */
export function generateElementClassNames(
    className: string,
    elementNames: Array<string>,
): Record<string, string> {
    const classes: Record<string, string> = {};

    elementNames.forEach((name) => {
        if (name) {
            classes[name] = getClassName(className, name);
        }
    });

    return classes;
}

