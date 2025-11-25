import path from 'path';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(path.resolve(process.cwd(), 'swagger', 'swagger.yaml'));

export default swaggerDocument;
