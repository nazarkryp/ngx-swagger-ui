import { Parameter } from './parameter';
import { Response } from './response';

export class Method {
    public endpoint: string;
    public description: string;
    public method: string;
    public operationId: string;
    public parameters: Parameter[];
    public responses: Response[];
}
