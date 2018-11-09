import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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

                const definitions = this.mapResponseDefinitions(response.definitions);
                documentation.groups = this.parseGroups(response.paths, definitions);

                return documentation;
            }));
    }

    private parseGroups(paths: { [name: string]: any }, definitions: any): MethodGroup[] {
        const groups = new Array<MethodGroup>();
        const keys = Object.keys(paths);

        for (let i = 0; i < keys.length; i++) {
            const endpoint = keys[i];
            const group = new MethodGroup();
            const groupTags: string[] = [];
            const path = paths[endpoint];

            const m = Object.keys(path);
            // const methods = new Array<Method>();
            // for (let j = 0; j < m.length; j++) {
            //     const pkey = m[j];
            //     const method = path[pkey];
            //     method.methodType = pkey;

            //     method.tags.forEach(tag => {
            //         groupTags.push(tag);
            //     });

            //     methods.push(method);
            // }

            const methods = Object.keys(path).map(pkey => {
                const method = path[pkey];
                method.methodType = pkey;

                method.tags.forEach(tag => {
                    groupTags.push(tag);
                });

                return method;
            });

            group.name = groupTags.filter(this.distinct).join(' ');
            group.endpoint = endpoint;
            group.methods = this.parseMethods(methods, endpoint, definitions);
            // group.methods = methods;

            const existing = groups.find(x => x.name === group.name);

            if (!existing) {
                groups.push(group);
            } else {
                existing.methods.push(...group.methods);
            }
        }

        return groups;

        // Object.keys(paths).forEach(endpoint => {
        //     const group = new MethodGroup();
        //     const groupTags: string[] = [];
        //     const path = paths[endpoint];

        //     const methods = Object.keys(path).map(pkey => {
        //         const method = path[pkey];
        //         method.methodType = pkey;

        //         method.tags.forEach(tag => {
        //             groupTags.push(tag);
        //         });

        //         return method;
        //     });

        //     group.name = groupTags.filter(this.distinct).join(' ');
        //     group.endpoint = endpoint;
        //     group.methods = this.parseMethods(methods, endpoint, documentationResponse);

        //     const existing = groups.find(x => x.name === group.name);

        //     if (!existing) {
        //         groups.push(group);
        //     } else {
        //         existing.methods.push(...group.methods);
        //     }
        // });
        // return groups;
    }

    private parseMethods(methods: any[], endpoint: string, definitions: any): Method[] {
        return methods.map(e => {
            const method = new Method();

            method.operationId = e.operationId.split('_')[1];
            method.endpoint = endpoint;
            method.method = e.methodType;
            method.description = e.summary;
            method.parameters = this.mapParameters(e.parameters, definitions);
            method.scopes = e.scopes ? e.scopes.map(s => s) : [];

            const responseCodes = Object.keys(e.responses);

            method.responses = responseCodes.map(code => {
                const r = e.responses[code];
                const response = new Response();
                response.code = +code;
                response.description = r.description;

                if (r.schema) {
                    const schema = this.mapDefinitions(r.schema, definitions);

                    response.schema = JSON.stringify(schema, null, 4);
                    // try {

                    // } catch (err) {
                    //     response.schema = JSON.stringify(r.schema, null, 4);
                    // }
                }

                return response;
            });

            return method;
        });
    }

    private mapParameters(parameters: any[], definitions: any): Parameter[] {
        return parameters.map(e => {
            const parameter = new Parameter();

            parameter.name = e.name;
            parameter.in = e.in;
            parameter.description = e.description;
            parameter.required = e.required;
            parameter.type = e.type;
            parameter.format = e.format;
            // parameter.schema = e.schema;

            if (e.schema) {
                const schema = this.mapDefinitions(e.schema, definitions);
                parameter.schema = JSON.stringify(schema, null, 4);
            }

            return parameter;
        });
    }

    private mapDefinitions(schema: any, definitions: any): any {
        if (schema.$ref) {
            const refArr = schema.$ref.split('/');
            const refKey = refArr[refArr.length - 1];
            const result = definitions[refKey];

            if (result.properties) {
                return result.properties;
            }

            if (result.data) {
                return result.data.items;
            }
        }

        return {};
    }

    private parseRef(response: any, definitions: any): any {
        const refArr = response['$ref'].split('/');
        const refKey = refArr[refArr.length - 1];

        if (definitions[refKey].properties) {
            return definitions[refKey].properties;
        }

        return definitions[refKey];
    }

    private getDefaultTypeValue(type: string) {
        switch (type) {
            case 'string':
                return 'string';
            case 'integer':
            case 'number':
                return 0;
            case 'boolean':
                return false;
            default:
                return 'object';
        }
    }

    private isArray(property: any) {
        if (property['type'] === 'array') {
            return true;
        }

        return false;
    }

    private distinct(value, index, self) {
        return self.indexOf(value) === index;
    }

    private mapResponseDefinitions(definitions: any): any {
        const definitionsKeys = Object.keys(definitions);
        console.log(`Definitions count: ${definitionsKeys.length}`);

        definitionsKeys.forEach(key => {
            this.parseDefition(key, definitions);
        });

        const result: { [name: string]: any } = {};

        definitionsKeys.forEach(key => {
            result[key] = definitions[key];

            // console.log(key);
            // if (key == 'DetailedLearningObjectModel') {
            //     debugger;
            //     const data = result[key];
            // }
        });

        return result;
    }

    private parseDefition(key: string, definitions: any) {
        const property = definitions[key].properties;
        const pnames = Object.keys(property);

        pnames.forEach(pname => {
            if (this.isScalar(property[pname])) {
                property[pname] = this.getDefaultTypeValue(property[pname].type);
            } else if (this.isArray(property[pname])) {
                if (this.isScalar(property[pname].items)) {
                    property[pname] = [this.getDefaultTypeValue(property[pname].items.type)];
                } else if (property[pname].items['$ref']) {
                    const refArr = property[pname].items.$ref.split('/');
                    const refKey = refArr[refArr.length - 1];
                    if (refKey !== key) {
                        property[pname] = [this.parseRef(property[pname].items, definitions)];
                    } else {
                        property[pname] = [{}];
                    }
                }
            } else if (property[pname]['$ref']) {
                property[pname] = this.parseRef(property[pname], definitions);
            }
        });
    }

    private isScalar(property: any) {
        if (property.type
            && (property.type === 'integer'
                || property.type === 'number'
                || property.type === 'string'
                || property.type === 'boolean')) {
            return true;
        }

        return false;
    }

    private isObject(property: any) {
        if (property.type && property.type === 'object') {
            return true;
        }

        return false;
    }
}
