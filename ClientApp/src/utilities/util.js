export const isEmptyObject = obj => {
    return obj ? JSON.stringify(obj) === "{}" : true;
}

export const clearObject = obj => {
    for (const prop of Object.keys(obj)) {
        delete obj[prop];
    }
}

export const intIds2Strings = (objs, keyProps = ["id"]) => {
    objs.forEach(obj => keyProps.forEach(prop => {
        if (obj.hasOwnProperty(prop)) obj[prop] = String(obj[prop]);
    }));

    return objs
}

export const StringIds2Ints = (objs, keyProps = ["id"]) => {
    objs.forEach(obj => keyProps.forEach(prop => {
        if (obj.hasOwnProperty(prop)) obj[prop] = parseInt(obj[prop]);
    }));

    return objs
}

export const pushNewObjectsNoDuplicate = (olds, news, key) => {
    news.forEach(n => {
        if (!olds.find(i => i[key] == n[key])) olds.push(n);
    });
}

export const replaceNewObject = (objs, obj, keyProp) => {
    const index = objs.findIndex(data => obj[keyProp] == data[keyProp]);
    const orgRow = objs[index];
    const newRow = { ...orgRow, ...obj };

    objs.splice(index, 1, newRow);

    return newRow;
}
