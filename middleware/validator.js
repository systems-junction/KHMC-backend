const validateParams = function (requestParams) {
    return function (req, res, next) {
        for (const param of requestParams) {
            if (checkParamPresent(Object.keys(req.body), param)) {
                const reqParam = req.body[param.param_key];
                if (!checkParamType(reqParam, param)) {
                    return res.status(400).send({
                        status: 400,
                        result: `${param.param_key} is of type ` +
                        `${typeof reqParam} but should be ${param.type}`
                    });
                } else if (!runValidators(reqParam, param)) {
                    return res.status(400).send({
                        status: 400,
                        result: `Validation failed for ${param.param_key}`
                    });
                }
            } else if (param.required){
                return res.status(400).send({
                    status: 400,
                    result: `Missing Parameter ${param.param_key}`
                });
            }
        }
        next();
    }
};

const checkParamPresent = function (reqParams, paramObj) {
    return (reqParams.includes(paramObj.param_key));
};

const checkParamType = function (reqParam, paramObj) {
    const reqParamType = typeof reqParam;
    return reqParamType === paramObj.type;
};

const runValidators = function (reqParam, paramObj) {
    if(paramObj.validator_functions){
        for (const validator of paramObj.validator_functions) {
            if (!validator(reqParam)) {
                return false
            }
        }
    }
    return true;
};

const checkEligibility = function (eligible) {
if(eligible)
{
    return true
}
else{
    return false
}
};

module.exports = {
    validateParams: validateParams,
    abc:checkEligibility
};