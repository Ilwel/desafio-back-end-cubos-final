function replaceCpf(str){
    return str.replace(".","").replace(".","").replace("-","")
};
function replacePhone(str){
    return str.replace("(","").replace(")","").replace("-","")
};
function replaceCep(str){
    return str.replace("-","")
};

module.exports =  {
    replaceCpf,
    replacePhone,
    replaceCep
} 