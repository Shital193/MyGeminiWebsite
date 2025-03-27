import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    //use to save the input data
    const [input,setInput] = useState("");
    //when we will click on send button, the input feild data
    //will be saved in recentPrompt and we will display it in
    //our main component
    const [recentPrompt,setRecentPrompt] = useState("");
    //we will use it to store all the input history
    // and display it in recent tab
    const [prevPrompts,setPrevPrompts] = useState([]);
    //boolean type,once it is true it will hide grid text and boxes
    //and in main component display the result
    const [showResult,setShowResult] = useState(false);
    //if it is true it will display one loading animation
    //and after getting data we will make it false so that 
    // we will display our data
    const [loading,setLoading] = useState(false);
    //use to display our result on our webpage
    const [resultData,setResultData] = useState("");

    const delayPara = (index,nextWord) =>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false) 
    }
    
    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
            response = await run(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await run(input)
        }
        // setRecentPrompt(input)
        // setPrevPrompts(prev => [...prev,input])
        // const response = await run(input)
        let responseArray = response.split("**");
        let newResponse="";
        for(let i = 0; i < responseArray.length; i++){
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        // setResultData(newResponse2)
        let newResponseArray = newResponse2.split(" ");
        for(let i = 0; i < newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")

    } 

    // onSent("what is react js")
    
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider