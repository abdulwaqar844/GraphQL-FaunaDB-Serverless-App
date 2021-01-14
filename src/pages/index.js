import React from "react"
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const GET_TODOS = gql`
{
  todos
  {
  id
  task
  status
}} `
console.log(res)
export default function Home(){
  const { loading, error, data } = useQuery(GET_TODOS);
  return (
    <div>Hello World</div>
  )
}