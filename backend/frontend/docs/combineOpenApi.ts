import fs from 'fs';
import path from 'path';
function combineSwaggerDocs(docsDir: string) {
  const combinedDocs = {
    openapi: '3.0.0',
    info: { title: 'API Documentation', version: '1.0.0' },
    paths: {},
    components: {
      schemas: {},
      responses: {},
      parameters: {},
      examples: {},
      requestBodies: {},
      headers: {},
      securitySchemes: {},
    },
  };

  function readDir(dir: string) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        readDir(itemPath); // Recursively process directories
      } else if (fs.statSync(itemPath).isFile() && item.endsWith('.json')) {
        const fileContent = JSON.parse(fs.readFileSync(itemPath, 'utf-8'));
        if (fileContent.paths) {
          combinedDocs.paths = {
            ...combinedDocs.paths,
            ...fileContent.paths,
          };
        }
        // Combine components
        if (fileContent.components) {
          // Merge schemas
          if (fileContent.components.schemas) {
            combinedDocs.components.schemas = {
              ...combinedDocs.components.schemas,
              ...fileContent.components.schemas,
            };
          }

          // Merge responses
          if (fileContent.components.responses) {
            combinedDocs.components.responses = {
              ...combinedDocs.components.responses,
              ...fileContent.components.responses,
            };
          }

          // Merge parameters
          if (fileContent.components.parameters) {
            combinedDocs.components.parameters = {
              ...combinedDocs.components.parameters,
              ...fileContent.components.parameters,
            };
          }

          // Merge examples
          if (fileContent.components.examples) {
            combinedDocs.components.examples = {
              ...combinedDocs.components.examples,
              ...fileContent.components.examples,
            };
          }

          // Merge requestBodies
          if (fileContent.components.requestBodies) {
            combinedDocs.components.requestBodies = {
              ...combinedDocs.components.requestBodies,
              ...fileContent.components.requestBodies,
            };
          }

          // Merge headers
          if (fileContent.components.headers) {
            combinedDocs.components.headers = {
              ...combinedDocs.components.headers,
              ...fileContent.components.headers,
            };
          }

          // Merge securitySchemes
          if (fileContent.components.securitySchemes) {
            combinedDocs.components.securitySchemes = {
              ...combinedDocs.components.securitySchemes,
              ...fileContent.components.securitySchemes,
            };
          }
        }
      }
    }
  }

  readDir(docsDir);
  return combinedDocs;
}

export default combineSwaggerDocs;
