import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DocumentationResponse } from 'app/models/response';
import { Method, Documentation, MethodGroup, Parameter } from 'app/models/documentation';
import { Response } from 'app/models/documentation/response';

@Injectable({
    providedIn: 'root'
})
export class SwaggerDataService {
    constructor(
        private httpClient: HttpClient) { }

    public getScheme(): Observable<Documentation> {
        return this.httpClient.get<DocumentationResponse>('./assets/swagger.json')
            .pipe(map(response => {
                const documentation = new Documentation();

                documentation.info = response.info;
                documentation.swagger = response.swagger;
                documentation.groups = this.parseGroups(response.paths, response);

                // swagger.methods = this.parseMethods(response);
                // swagger.definitions = response.definitions;

                return documentation;
            }));
    }

    private parseGroups(paths: { [name: string]: any }, documentationResponse: DocumentationResponse): MethodGroup[] {
        const groups = new Array<MethodGroup>();

        Object.keys(paths).forEach(endpoint => {
            const group = new MethodGroup();
            const groupTags: string[] = [];

            const path = paths[endpoint];
            const pathKeys = Object.keys(path);

            const methods = pathKeys.map(pkey => {
                const method = path[pkey];
                method.methodType = pkey;

                method.tags.forEach(tag => {
                    groupTags.push(tag);
                });

                return method;
            });

            group.name = groupTags.filter(this.distinct).join(' ');
            group.methods = this.parseMethods(methods, endpoint, documentationResponse);

            const existing = groups.find(x => x.name === group.name);

            if (!existing) {
                groups.push(group);
            } else {
                existing.methods.push(...group.methods);
            }
        });

        return groups;
    }

    private parseMethods(methods: any[], endpoint: string, documentationResponse: DocumentationResponse): Method[] {
        return methods.map(e => {
            const method = new Method();

            method.operationId = e.operationId.split('_')[1];
            method.endpoint = endpoint;
            method.method = e.methodType;
            method.description = e.summary;
            method.parameters = this.mapParameters(e.parameters);

            const responseCodes = Object.keys(e.responses);
            method.responses = responseCodes.map(code => {
                const r = e.responses[code];

                const response = new Response();
                response.code = +code;
                response.description = r.description;

                if (r.schema) {
                    response.schema = this.mapDefinitions(r.schema, documentationResponse);
                }

                // if (r.schema && r.schema['$ref']) {
                //     response.schema = this.mapResponse(r.schema['$ref'], documentationResponse);
                // }

                return response;
            });

            return method;
        });
    }

    private distinct(value, index, self) {
        return self.indexOf(value) === index;
    }

    private mapResponse(ref: string, documentation: DocumentationResponse): any {
        const refArr = ref.split('/');
        const key = refArr[refArr.length - 1];
        const definition = documentation.definitions[key];

        const description = definition.description;
        const type = definition.type;
        const properties = JSON.stringify(definition.properties, null, 4);

        return properties;
    }

    private mapParameters(parameters: any[]): Parameter[] {
        return parameters.map(e => {
            const parameter = new Parameter();

            parameter.name = e.name;
            parameter.in = e.in;
            parameter.description = e.description;
            parameter.required = e.required;
            parameter.type = e.number;
            parameter.format = e.format;
            parameter.schema = e.schema;

            return parameter;
        });
    }

    private mapDefinitions(property: any, documentation: DocumentationResponse) {
        const keys = Object.keys(property);

        keys.forEach(key => {
            if (key === '$ref') {
                const refArr = property[key].split('/');
                const refKey = refArr[refArr.length - 1];
                const definition = documentation.definitions[refKey].properties;
                property[key] = definition;
                this.mapDefinitions(definition, documentation);
            } else {
                // result[key] = property[key];
            }

            this.mapDefinitions(property[key], documentation);
        });
    }
}
