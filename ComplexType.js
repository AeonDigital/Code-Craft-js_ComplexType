/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module ComplexType
* @file JS ComplexType
*
* @requires BasicTools
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/
'use strict';




// --------------------
// Caso não exista, inicia objeto CodeCraft
var CodeCraft = (CodeCraft || function () { });
if(typeof(CodeCraft) === 'function') { CodeCraft = new CodeCraft(); };





/**
* Permite criar tipos complexos de dados com regras de validação e formatação.
*
* @class ComplexType
*
* @memberof CodeCraft
*
* @static
*
* @type {Class}
*/
CodeCraft.ComplexType = new (function () {
    var _bt = CodeCraft.BasicTools;








    /**
    * Tipo dado "primitivo".
    * 
    * @deftype {PrimitiveType}
    *
    * @property {String}                        Name                                Nome do tipo.
    * @property {Function}                      Validate                            Função que efetua a validação do tipo.
    * @property {Function}                      TryParse                            Função que tenta converter o valor original para este tipo.
    * @property {Integer}                       Min                                 Valor mínimo que pode ser assumido por este tipo.
    * @property {Integer}                       Max                                 Valor máximo que pode ser assumido por este tipo.
    */



    /**
    * Objeto de definição de tipos de dados especiais.
    * [Objeto originalmente definido em CodeCraft.StringExtension]
    *
    * @typedef DataFormat
    *
    * @global
    *
    * @property {?String}                       Mask                                Mascara do formato que se quer representar.
    * @property {RegExp}                        RegExp                              Objeto "RegExp" responsável por validar o formato indicado.
    * @property {?Integer}                      MinLength = null                    Número mínimo de caracteres aceitos para descrever o formato.
    * @property {?Integer}                      MaxLength = null                    Número máximo de caracteres aceitos para descrever o formato.
    * @property {Function}                      Check                               Função validadora do tipo de dado.
    * @property {Function}                      Format                              Função formatadora do tipo.
    * @property {?Function}                     RemoveFormat                        Função para remover formato inserido.
    */



    /**
    * Representa um tipo complexo de dados.
    * 
    * @typedef {ComplexType}
    *
    * @property {String}                        Name                                Nome do tipo.
    * @property {PrimitiveType}                 Type                                Tipo de dado primitivo aceito.
    * @property {Integer}                       Length = null                       Tamanho máximo de um campo do tipo String, Use "null" para um campo de tamanho ilimitado.
    * @property {Integer}                       Min = null                          Menor valor numérico que o campo pode ter.
    * @property {Integer}                       Max = null                          Maior valor numérico que o campo pode ter.
    * @property {String}                        RefType = null                      Nome do tipo ao qual este deve ser uma referência.
    * @property {Boolean}                       AllowSet = true                     Indica que o valor pode ser setado pelo usuário [senão é o próprio objeto quem define seu valor].
    * @property {Boolean}                       AllowNull = true                    Indica se permite que o valor seja nulo [null].
    * @property {Boolean}                       AllowEmpty = false                  Indica se permite que o valor seja vazio [''].
    * @property {Boolean}                       Unique = false                      Indica que este valor não deve ser repetido em uma coleção de objetos deste tipo.
    * @property {Boolean}                       ReadOnly = false                    Indica que o valor só será setado 1 vez.
    * @property {String}                        Default = null                      Valor inicial para uma variável deste tipo.
    * @property {DataFormat}                    FormatSet = null                    Objeto de definições para formatação.
    * @property {Function}                      CheckValue                          Função que verifica um valor informado frente a todas as regras definidas.
    */

















    /*
    * PROPRIEDADES PRIVADAS
    */


    /**
    * Coleção de tipos de dados primitivos.
    *
    * @type {PrimitiveType[]}
    */
    var _primitiveTypes = [
        {
            Name: 'Boolean',
            Validate: function (v) { return (typeof (v) === 'boolean') ? true : false; },
            TryParse: function (v) { return _bt.TryParse.ToBoolean(v); }
        },
        {
            Name: 'Byte',           // INTEGER 8 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -128,
            Max: 127
        },
        {
            Name: 'Short',          // INTEGER 16 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -32768,
            Max: 32767
        },
        {
            Name: 'Integer',        // INTEGER 32 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -2147483648,
            Max: 2147483647
        },
        {
            Name: 'Long',           // INTEGER 64 BITS
            Validate: function (v) { return _bt.IsInteger(v); },
            TryParse: function (v) { return _bt.TryParse.ToInteger(v); },
            Min: -9223372036854775296, // -9223372036854775808
            Max: 9223372036854775296   //  9223372036854775807
        },
        {
            Name: 'Float',          // FLOAT 32 BITS
            Validate: function (v) { return _bt.IsNumber(v); },
            TryParse: function (v) { return _bt.TryParse.ToFloat(v); },
            Min: -2147483648,
            Max: 2147483647
        },
        {
            Name: 'Double',         // FLOAT 64 BITS
            Validate: function (v) { return _bt.IsNumber(v); },
            TryParse: function (v) { return _bt.TryParse.ToFloat(v); },
            Min: -9223372036854775296, // -9223372036854775808
            Max: 9223372036854775296   //  9223372036854775807
        },
        {
            Name: 'Date',
            Validate: function (v) { return (Object.prototype.toString.call(v) === '[object Date]') ? true : false; },
            TryParse: function (v) {
                if (Object.prototype.toString.call(v) === '[object Date]') { return v; }
                else if (typeof (v) === 'string') {
                    var d = new Date(v);
                    if (d && d.getFullYear() > 0) { return d; }
                }

                return v;
            },
            ParseToString: function (v) {
                var s = null;
                for (var it in _primitiveTypes) {
                    if (_primitiveTypes[it].Name == 'String') {
                        s = _primitiveTypes[it];
                        break;
                    }
                }
                return s.TryParse(v);
            },
            Min: new Date(-14831762400000),     // Mon Jan 01 1500 00:00:00
            Max: new Date(32503687199999)       // Tue Dec 31 2999 23:59:59
        },
        {
            Name: 'String',
            Validate: function (v) { return (typeof (v) === 'string') ? true : false; },
            TryParse: function (v) {
                if (typeof (v) === 'string') { return v; }
                else if (typeof (v) === 'boolean') { return (v) ? '1' : '0'; }
                else if (Object.prototype.toString.call(v) === '[object Date]') {
                    var y = v.getFullYear().toString();
                    var M = (v.getMonth() + 1).toString();
                    var d = v.getDate().toString();
                    var H = v.getHours().toString();
                    var m = v.getMinutes().toString();
                    var s = v.getSeconds().toString();

                    // Adiciona 2 digitos a todas partes
                    M = (M.length == 1) ? '0' + M : M;
                    d = (d.length == 1) ? '0' + d : d;
                    H = (H.length == 1) ? '0' + H : H;
                    m = (m.length == 1) ? '0' + m : m;
                    s = (s.length == 1) ? '0' + s : s;

                    v = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
                }

                return v.toString();
            }
        },
        {
            Name: 'Text',
            Validate: function (v) { return (typeof (v) === 'string') ? true : false; },
            TryParse: function (v) {
                if (typeof (v) === 'string') { return v; }
                else if (typeof (v) === 'boolean') { return (v) ? '1' : '0'; }
                else if (Object.prototype.toString.call(v) === '[object Date]') {
                    var y = v.getFullYear().toString();
                    var M = (v.getMonth() + 1).toString();
                    var d = v.getDate().toString();
                    var H = v.getHours().toString();
                    var m = v.getMinutes().toString();
                    var s = v.getSeconds().toString();

                    // Adiciona 2 digitos a todas partes
                    M = (M.length == 1) ? '0' + M : M;
                    d = (d.length == 1) ? '0' + d : d;
                    H = (H.length == 1) ? '0' + H : H;
                    m = (m.length == 1) ? '0' + m : m;
                    s = (s.length == 1) ? '0' + s : s;

                    v = y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s;
                }

                return v.toString();
            }
        },
        {
            Name: 'Enum',
            Validate: function (v, kp) {
                for (var it in kp) {
                    if (it === v) { return true; }
                }
                return false;
            },
            TryParse: function (v, kp) {
                for (var it in kp) {
                    if (it === v || kp[it] === v) { return it; }
                }
                return v;
            }
        },
        {
            Name: 'Object',
            Validate: function (v) { return (typeof (v) === 'object') ? true : false; },
            TryParse: function (v) { return v; }
        },
        {
            Name: 'Object[]',
            Validate: function (v) {
                var r = true;
                for (var it in v) {
                    if (typeof (v[it]) !== 'object') {
                        r = false;
                        break;
                    }
                }
                return r;
            },
            TryParse: function (v) { return v; }
        }
    ];




















    /*
    * MÉTODOS GERADORES DE OBJETOS
    */



    /**
    * A partir de todas as configurações para o objeto informado, verifica a validade do valor informado.
    * Retorna "undefined" caso o valor seja inválido, ou retorna o valor devidamente formatado.
    * 
    * @function _checkValue
    *
    * @private
    *
    * @param {Object}                           val                                 Valor que será testado.
    * @param {ComplexType}                      cType                               Regras para a coluna de dados.
    *
    * @return {[undefined|Object]}
    */
    var _checkValue = function (val, cType) {
        var isOK = true;



        // Se é permitido o set externo deste tipo ...
        if (cType.AllowSet) {

            // Corrige valores nulos para quando há um valor padrão.
            if (val == undefined || val == null) {
                val = cType.Default;

                // Verifica tratamento especial para formato Date
                if (cType.Type.Name === 'Date' && cType.Default === 'new') {
                    val = new Date();
                }
            }


            // Se for um valor considerado vazio, nulo ou indefinido
            if (!_bt.IsNotNullValue(val)) {
                if ((val == null && cType.AllowNull == false) || (val == '' && cType.AllowEmpty == false)) {
                    isOK = false;
                    console.log('[DoesNotAcceptNullValues] : Column "' + cType.Name + '" Does Not Accept Null Values.');
                }
            }
            // Senão, se há um valor setado...
            else {
                // Se há um removedor de formado disponível, usa-o antes de qualquer validação.
                val = (cType.FormatSet != null && cType.FormatSet.RemoveFormat != null) ? cType.FormatSet.RemoveFormat(val) : val;

                // Se há uma verificação de formato disponível, verifica...
                if (cType.FormatSet != null && cType.FormatSet.Check != null && !cType.FormatSet.Check(val)) {
                    isOK = false;
                    console.log('[InvalidValue] : Invalid Value ["' + val + '"] For ComplexType "' + cType.Name + '".');
                }
                else {

                    // Verifica o tipo do valor indicado
                    val = cType.Type.TryParse(val, cType.RefType);

                    // Valida o valor conforme o tipo de dado primitivo,
                    // ENUNs são testados aqui
                    isOK = cType.Type.Validate(val, cType.RefType);
                    if (!isOK) {
                        console.log('[InvalidValue] : Invalid Value ["' + val + '"] For ComplexType "' + cType.Name + '".');
                    }
                    else {
                        switch (cType.Type.Name) {
                            // Verificação para String                          
                            case 'String':
                            case 'Text':

                                // Verifica tamanho da mesma.
                                if (cType.Length != null && val.length > cType.Length) {
                                    isOK = false;
                                    console.log('[MaxLengthExceeded] : Max Length Exceeded For ComplexType "' + cType.Name + '", Value ["' + val + '"].');
                                }
                                else {
                                    // Havendo um formatador, executa-o
                                    val = (cType.FormatSet != null && cType.FormatSet.Format != null) ? cType.FormatSet.Format(val) : val;
                                }


                                break;

                            // Verificação para Numerais e Date                         
                            case 'Date':
                            case 'Byte':
                            case 'Short':
                            case 'Integer':
                            case 'Long':
                            case 'Float':
                            case 'Double':
                                if (val < cType.Min || val > cType.Max) {
                                    isOK = false;
                                    console.log('[OutOfRange] : Value "' + val + '" Is Out Of Range For ComplexType "' + cType.Name + '[' + cType.Type.Name + ']".');
                                }

                                break;
                        }
                    }
                }
            }
        }
        else {
            // Corrige valores nulos para quando há um valor padrão.
            if (val == undefined || val == null) {
                val = cType.Default;

                // Verifica tratamento especial para formato Date
                if (cType.Type.Name === 'Date' && cType.Default === 'new') {
                    val = new Date();
                }
            }
        }


        return (isOK) ? val : undefined;
    };


















    /**
    * OBJETO PÚBLICO QUE SERÁ EXPOSTO.
    */
    var _public = this.Control = {
        /**
        * Cria um novo objeto "DataTableColumn".
        * 
        * @function CreateNewType
        *
        * @memberof ComplexType
        *
        * @param {String}                       parName                             Nome do tipo.
        * @param {PrimitiveType}                parType                             Tipo de dado primitivo aceito.
        * @param {Integer}                      [parLength = null]                  Tamanho máximo para um campo do tipo String.
        * @param {Integer}                      [parMin = null]                     Valor mínimo aceito para um campo numérico.
        * @param {Integer}                      [parMax = null]                     Valor máximo aceito para um campo numérico.
        * @param {String}                       [parRefType = null]                 Nome do tipo ao qual este deve ser uma referência.
        * @param {Boolean}                      [parAllowSet = true]                Indica que o valor pode ser setado pelo usuário.
        * @param {Boolean}                      [parAllowNull = true]               Indica se permite que o valor seja nulo [null].
        * @param {Boolean}                      [parAllowEmpty = false]             Indica se permite que o valor seja vazio [''].
        * @param {Boolean}                      [parUnique = false]                 Indica que este valor não deve ser repetido em uma coleção de objetos deste tipo.
        * @param {Boolean}                      [parReadOnly = false]               Indica que o valor só será setado 1 vez.
        * @param {String}                       [parDefault = null]                 Valor inicial para uma variável deste tipo.
        * @param {DataFormat}                   [parFormatSet = null]               Objeto de definições para formatação.
        *
        * @return {?ComplexType}
        */
        CreateNewType: function (parName, parType, parLength, parMin, parMax, parRefType,
                                            parAllowSet, parAllowNull, parAllowEmpty, parUnique, parReadOnly, parDefault, parFormatSet) {
            var Type = null;


            for (var it in _primitiveTypes) {
                if (_primitiveTypes[it].Name == parType || _primitiveTypes[it] == parType) {
                    Type = _primitiveTypes[it];
                }
            }



            if (Type == null) {
                console.log('[InvalidType] : Type "' + parType + '" Is Invalid.');
            }
            else {
                var isOk = true;

                // Efetua verificação para tipo Enum
                if (Type.Name == 'Enum') {
                    if (_bt.IsObject(parRefType)) {
                        var tArr = {};
                        for (var it in parRefType) {
                            tArr[it] = parRefType[it].toString();
                        }
                        parRefType = tArr;
                    }
                    else {
                        parRefType = null;
                    }


                    // Caso seja nulo...
                    if (!_bt.IsNotNullValue(parRefType)) {
                        isOk = false;
                        console.log('[InvalidType] : For "Enum" Is Expected a Key/Pair Object For "parRefType" Parameter.');
                    }
                }


                if (isOk) {
                    parLength = _bt.InitiSet(parLength, null, true);
                    parMin = _bt.InitiSet(parMin, null, true);
                    parMax = _bt.InitiSet(parMax, null, true);

                    parRefType = _bt.InitiSet(parRefType, null, true);
                    parAllowSet = _bt.InitiSet(parAllowSet, true, true);
                    parAllowNull = _bt.InitiSet(parAllowNull, true, true);
                    parAllowEmpty = _bt.InitiSet(parAllowEmpty, false, true);
                    parUnique = _bt.InitiSet(parUnique, false, true);
                    parReadOnly = _bt.InitiSet(parReadOnly, false, true);
                    parDefault = _bt.InitiSet(parDefault, null, true);
                    parFormatSet = _bt.InitiSet(parFormatSet, null, true);



                    // Tratamentos especiais conforme o tipo...
                    switch (Type.Name) {
                        case 'Boolean':
                        case 'Object':
                        case 'Object[]':
                            parLength = null;
                            parMin = null;
                            parMax = null;
                            parFormatSet = null;

                            if (Type.Name == 'Object[]' && !_bt.IsNotNullValue(parDefault)) { parDefault = []; }

                            break;

                        case 'String':
                        case 'Text':
                            parMin = null;
                            parMax = null;
                            if (parFormatSet != null && parFormatSet.MaxLength != null) {
                                parLength = parFormatSet.MaxLength;
                            }

                            break;

                        case 'Enum':
                            parMin = null;
                            parMax = null;
                            parFormatSet = null;

                            break;

                        case 'Date':
                        case 'Byte':
                        case 'Short':
                        case 'Integer':
                        case 'Long':
                        case 'Float':
                        case 'Double':
                            parLength = null;
                            parMin = (parMin != null && parMin >= Type.Min) ? parMin : Type.Min;
                            parMax = (parMax != null && parMax <= Type.Max) ? parMax : Type.Max;

                            break;
                    }


                    return {
                        Name: parName,
                        Type: Type,
                        Length: parLength,
                        Min: parMin,
                        Max: parMax,
                        RefType: parRefType,
                        AllowSet: parAllowSet,
                        AllowNull: parAllowNull,
                        AllowEmpty: parAllowEmpty,
                        Unique: parUnique,
                        ReadOnly: parReadOnly,
                        Default: parDefault,
                        FormatSet: parFormatSet,
                        CheckValue: function (val) { return _checkValue(val, this); }
                    };
                }
            }


            return null;
        }
    };


    return _public;
});