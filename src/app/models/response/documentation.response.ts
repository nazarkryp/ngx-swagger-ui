export class DocumentationResponse {
    public swagger: string;
    public info: string;
    public host: string;
    public paths: { [name: string]: any };
    public definitions: { [name: string]: any };
    public securityDefinitions: { [name: string]: any };
}
