export interface IRuleType {
    ok:           boolean;
    msg:          string;
    RuleCodeType: RuleCodeType;
}

export interface RuleCodeType {
    Id:          string;
    Description: string;
}
