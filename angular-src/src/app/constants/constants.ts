// Constants and enums to be used throughout the project.


export enum Roles {
    admin,
    standard
}

export const roleDict: {[key: string]: Roles} = { };
roleDict['admin'] = Roles.admin;
roleDict['standard'] = Roles.standard;
