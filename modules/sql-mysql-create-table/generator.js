module.exports = async function (cmd) {
    let lines = cmd.trim().split('\n');
    let { table_name, remaining_lines } = acquireProperty('table_name', lines);
    let { fields } = processFields(remaining_lines);
    let statement = generateCreateTableStatement({ table_name, fields });
    return statement;
}
/**
 * Get the fields for the table based on the lines provided
 * @param {*} lines 
 */
function processFields(lines) {
    let regex = /(.+)\:(?:\s+)(.+)/;
    let new_state = lines.reduce((state, line, idx) => {
        let matches = regex.exec(line);
        if (matches && matches.length > 1) {
            let name = matches[1];
            let specifiers = matches[2];
            state.fields.push({ name, specifiers });
        }
        return state;
    }, {
            fields: [],
            remaining_lines: []
        }
    )
    return new_state;
}
/**
 * Get a specific property by the name
 * @param {*} property_name 
 * @param {*} lines 
 */
function acquireProperty(property_name, lines) {
    let property = `table_name`;
    let regex = new RegExp(`${property}\:\\s(.+)`);
    // let regex = /table_name\:(.+)/
    let new_state = lines.reduce((state, line, idx) => {
        let matches = regex.exec(line);
        if (matches && matches.length > 0) {
            state[property_name] = matches[1]
        }
        else {
            state.remaining_lines.push(line);
        }
        return state;
    }, {
            processed: null,
            remaining_lines: []
        }
    );
    return new_state;
}

/**
 * Generate new SQL statement
 * @param {CreateTableConfig} config 
 */
function generateCreateTableStatement(config) {
    let { table_name, fields } = config;
    let additional_field_lines = additionalFieldLines();

    //Start constructing the multiline strings
    let field_lines = fields.map(field => generateFieldLine(field)).concat(additional_field_lines); //each line is one field
    let index_lines = fields.map(field => generateIndexLine(table_name, field)).filter(line => line ? true : false);
    let unique_lines = fields.map(field => generateUniqueKeyLine(table_name, field)).filter(line => line ? true : false);
    let primary_key_fields = fields.filter(field => isPrimaryKey(field));

    //Aggregate multiline and single line commands
    let create_table_line = `CREATE TABLE \`${table_name}\``;
    let pk_line = `PRIMARY KEY (\`${primary_key_fields.map(field => field.name).join(', ')}\`)`;
    let field_lines_str = field_lines.length > 0 ? field_lines.reduce((last, cur, idx) => `${last},\n${cur}`) : '';
    let index_lines_str = index_lines.length > 0 ? index_lines.reduce((last, cur, idx) => `${last},\n${cur}`) : '';
    let unique_lines_str = unique_lines.length > 0 ? unique_lines.reduce((last, cur, idx) => `${last},\n${cur}`) : '';
    let engine_line = 'ENGINE=InnoDB DEFAULT CHARSET=utf8;';

    let sql_final = `${create_table_line} (
        ${field_lines_str},

        ${pk_line}${index_lines.length > 0 ? ',' : ''}
        ${index_lines_str}${unique_lines.length > 0 ? ',' : ''}
        ${unique_lines_str}

    ) ${engine_line}`.split('\n').map(line => line.trim()).join('\n');

    let statement = JSON.stringify({ ...config, sql_final }, null, 4);
    return sql_final;
}
function additionalFieldLines() {
    let lines = ['`created_by` varchar(50) DEFAULT NULL',
        '`created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
        '`updated_by` varchar(50) DEFAULT NULL',
        '`updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP']
    return lines;
}
/**
 * @param {string} table_name
 * @param {Field} field 
 */
function generateUniqueKeyLine(table_name, field) {
    let specifiers = getSpecifiers(field);
    if (specifiers.indexOf('UNIQUE') !== -1) {
        return `UNIQUE KEY \`UK_${table_name.toUpperCase()}_${field.name}\` (\`${field.name}\`)`
    }
    return '';
}
/**
 * @param {string} table_name
 * @param {Field} field 
 */
function generateIndexLine(table_name, field) {
    let specifiers = getSpecifiers(field);
    if (specifiers.indexOf('INDEX') !== -1) {
        return `INDEX \`IX_${table_name.toUpperCase()}_${field.name}\` (\`${field.name}\`)`
    }
    return '';
}
/**
 * @param {Field} field 
 */
function generateFieldLine(field) {
    let specifiers = getSpecifiers(field);
    let is_null_field = isNullField(field);
    let type = getType(specifiers);
    let default_component = is_null_field ? 'DEFAULT NULL' : `NOT NULL DEFAULT ''`;
    //Acquire the datatype
    return `\`${field.name}\` ${type} ${default_component}`;
}
/**
 * 
 * @param {Field} field 
 */
function isPrimaryKey(field) {
    let specifiers = getSpecifiers(field);
    if (specifiers.indexOf('PRIMARY') !== -1) {
        return true;
    }
    return false;
}
/**
 * 
 * @param {Field} field 
 */
function isNullField(field) {
    let specifiers = getSpecifiers(field);
    console.log(specifiers);
    if (specifiers.indexOf('NULL') !== -1) {
        return true;
    }
    return false;
}
/**
 * @param {Field} field 
 */
function getSpecifiers(field) {
    let specifiers = field.specifiers.split(',').map(specifier => specifier.toUpperCase().trim());
    return specifiers;
}
/**
 * @param {String[]} specifiers 
 */
function getType(specifiers) {
    let supported_types = [
        'BIT',
        'TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'INTEGER', 'BIGINT', 'DECIMAL', 'DEC', 'FLOAT', 'DOUBLE',
        'BOOL', 'BOOLEAN',
        'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'YEAR',
        'CHAR', 'VARCHAR', 'TEXT', 'ENUM', 'SET', 'NVARCHAR'
    ]
    let type = specifiers.reduce((last, cur, idx) => {
        if (last) { //Fast forward
            return last;
        }

        let field_regex_component = supported_types.reduce((last, cur, idx) => {
            return `${last}|${cur}`;
        });
        let field_regex = new RegExp(`((?:${field_regex_component})(?:\\([0-9]+\\))?)`);
        let match = field_regex.exec(cur);
        if (match && match.length > 0) {
            last = match[1];
        }
        return last;
    }, null)
    return type;
}
/**
 * @typedef CreateTableConfig
 * @property {string} table_name
 * @property {Field[]} fields
 */
/**
 * @typedef Field
 * @property {string} name
 * @property {string} specifiers
 */



        // 'CREATE TABLE `service_provider` (\n' +
        // '  `service_provider_id` varchar(50) NOT NULL DEFAULT\'\',\n' +
        // '  `service_provider_name` varchar(255) NOT NULL DEFAULT \'\',\n' +
        // '  `service_provider_identifier` varchar(255) NOT NULL,\n' +
        // '  `created_by` varchar(50) DEFAULT NULL,\n' +
        // '  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n' +
        // '  `updated_by` varchar(50) DEFAULT NULL,\n' +
        // '  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n' +
        // '  PRIMARY KEY (`service_provider_id`),\n' +
        // '  UNIQUE KEY `UK_SERVICE_PROVIDER_service_provider_identifier`(`service_provider_identifier`),\n' +
        // '  INDEX `IX_SERVICE_PROVIDER_service_provider_identifier` (`service_provider_identifier`)\n' +
        // ') ENGINE=InnoDB DEFAULT CHARSET=utf8;',