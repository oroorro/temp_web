import { registry } from '../registry';
import type { UIDeclaration } from '../types';
import { validateDeclaration } from '../validate';
import dashboardPageJson from './dashboard.page.json';
import projectFormJson from './project.form.json';
import settingsFormJson from './settings.form.json';

/**
 * Types a JSON declaration and checks it against the registry once, at startup,
 * so a typo in a JSON file shows up in the console instead of going unnoticed.
 */
function defineDeclaration(raw: unknown): UIDeclaration {
  const declaration = raw as UIDeclaration;
  const problems = validateDeclaration(declaration, registry);
  if (problems.length > 0) {
    console.error(
      `[ui-schema] Declaration "${declaration.id}" has ${problems.length} problem(s):\n` +
        problems.map((problem) => `  ${problem.path} ${problem.message}`).join('\n'),
    );
  }
  return declaration;
}

export const dashboardPage = defineDeclaration(dashboardPageJson);
export const projectForm = defineDeclaration(projectFormJson);
export const settingsForm = defineDeclaration(settingsFormJson);
