from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

duck_search=DuckDuckGoSearchRun()

@tool('searching_tool', description='search user queries')
def duck_search_tool(query: str) -> str:
  '''Search information from internet based on query'''
  return duck_search.invoke(query)