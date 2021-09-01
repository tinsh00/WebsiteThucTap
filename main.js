function Validator(option){
    function getParent (element,selector) {

        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        }
    }

    var selectorRule = {};
    //hàm thực hiện validate
    function validate(inputElement,rule){
        var errorElement = getParent(inputElement,option.formGroupSelector).querySelector(option.errorSelector);
        var errorMessage ;

        //lấy ra các rule của selector
        var rules =selectorRule[rule.selector];
        
        // lặp qua từng rule kiêmtra có lỗi thì break luôn khỏi vòng lặp và lấy lỗi đó
        for(var i =0;i<rules.length;++i){
            switch (inputElement.type){
                case 'radio':
                case  'checkbox':
                    errorMessage=rules[i](
                        formElement.querySelector(rule.selector+ ':checked')
                    );
                    break;
                default :
                errorMessage=rules[i](inputElement.value);
            }
            if(errorMessage){
                break;
            };
        };
        if(errorMessage){
            getParent(inputElement,option.formGroupSelector).classList.add('invalid');
            errorElement.innerText=errorMessage;
        }else{
            getParent(inputElement,option.formGroupSelector).classList.remove('invalid');
            errorElement.innerText='';
        }
        return !errorMessage;
    }

    //hàm lấy element của form
    var formElement = document.querySelector(option.form);
    if(formElement){
        //khi submit form 
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;
            //lặp qua hết các rule và validate luôn
            option.rule.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                
                var isValid =  validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                };
            });

          
            
            if(isFormValid){
                //trường hợp submit với JavaScript
               // console.log('không có lỗi'); => lấy dữ liệu
            //    if(typeof option.onSubmit ==='function'){
            //           //lấy tất cả field có att là name , ko lấy field có att là disable
            //         var enableInputs = formElement.querySelectorAll('[name]');
            //         //=>return Nodelist = > chuyển về Array
            //          var formValues = Array.from(enableInputs).reduce(function (values, input) {
            //              switch(input.type){
            //                  case 'radio':
            //                         values[input.name] = formElement.querySelector('input[name="'+input.name + '"]:checked').value;
            //                     break;
            //                  case 'checkbox':
            //                      if(!input.matches(':checked')) {
            //                         values[input.name]='';
            //                         return values;
            //                      };
            //                      if(!Array.isArray(values[input.name])){
            //                         values[input.name]=[];
            //                      };
            //                      values[input.name].push(input.value);
            //                      break;
            //                 case 'file':
            //                     values[input.name] = input.files;
            //                      break;
            //                 default:
            //                     values[input.name] = input.value;
            //              }
                       
            //                 return values;
            //              },{});
            //        option.onSubmit(formValues);
            //    }
            //    else{
                   //trường hợp submit với hành vi mặc định
                   formElement.submit();
            // }

            }

        }

        //lặp qua mỗi rule và xử lí (lắng nghe sự kiện blur, input)
        option.rule.forEach(function (rule){

           
            //lưu các rules cho mỗi input
            //phần tử đầu tiên không phải là mảng thì sẽ tạo 1 mảng 1 phần tử là rule.test
            //phần tử tiếp theo sẽ đc push vào mảng
            if (Array.isArray(selectorRule[rule.selector])){
                selectorRule[rule.selector].push(rule.test);
            } else {
                selectorRule[rule.selector]= [rule.test];
            }


            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function (inputElement){ 
                if(inputElement){
                    // xử lí khi blur ra khỏi input
                    inputElement.onblur = function (){
                       validate(inputElement,rule);
                    }
                    // xử lí khi đang nhập không hiện lỗi
                    inputElement.oninput = function(){
                        var errorElement = getParent(inputElement,option.formGroupSelector).querySelector(option.errorSelector);
                        getParent(inputElement,option.formGroupSelector).classList.remove('invalid');
                        errorElement.innerText='';
                    }
                }
            })

            
        });
        ///console.log(selectorRule);
    }
}

//định nghĩa rule
//nguyên tắc rule :
//1 . khi có lỗi => return message lỗi
//2 . khi hợp lệ => return underfined
Validator.isRequired = function (selector,message       ) {
    return {
        selector:selector,
        test: function (value) {  
            return value ? undefined :message || 'Vui lòng nhập trường này ';
        } 
    }  
}

Validator.isEmail = function (selector,message) {
    return {
        selector:selector,
        test: function (value) {  
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value.trim()) ? undefined :message || 'Trường này phải là email';
        } 
    }  
}

Validator.isMinLengh = function (selector,min,message) {
    return {
        selector:selector,
        test: function (value) {  
            return value.length >=min ? undefined :message || 'mật khẩu lớn hơn 6 kí tự';
        } 
    }  
}
Validator.isConfirmed = function (selector,getConfimValue,message) {
    return {
        selector:selector,
        test: function (value) {  
            return  value===getConfimValue() ? undefined :message || 'mật khẩu lớn hơn 6 kí tự';
        } 
    }  
}