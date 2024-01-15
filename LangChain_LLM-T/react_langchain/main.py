from langchain.docstore.wikipedia import Wikipedia
# from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, Tool, AgentExecutor
from langchain.agents.react.base import DocstoreExplorer

# build tools
docstore=DocstoreExplorer(Wikipedia())
tools = [
  Tool(
    name="Search",
    func=docstore.search,
    description="Search for a term in the docstore.",
  ),
  Tool(
    name="Lookup",
    func=docstore.lookup,
    description="Lookup a term in the docstore.",
  )
]

# build LLM
llm = ChatOpenAI(
  model_name="gpt-3.5-turbo-1106",
  temperature=0,
  openai_api_key="",
)

# initialize ReAct agent
react = initialize_agent(tools, llm, agent="react-docstore", verbose=True)
agent_executor = AgentExecutor.from_agent_and_tools(
  agent=react.agent,
  tools=tools,
  verbose=True,
)

# perform question-answering
question = "Author David Chanoff has collaborated with a U.S. Navy admiral who served as the ambassador to the United Kingdom under which President?"
agent_executor.run(question)