import { MethodGroup } from './method-group';

export class Documentation {
    public swagger: string;
    public info: string;
    public groups: MethodGroup[];
    public schemes: string[];
    public paths: any;
    public definitions: any;
    public securityDefinitions: any;
}
