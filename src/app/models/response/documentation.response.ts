export class DocumentationResponse {
    public swagger: string;
    public info: string;
    public host: string;
    public schemes: string[];
    public paths: { [name: string]: any };
    public definitions: any;
    public securityDefinitions: any;
}
