import { getTopicsForNeighbors } from "@/app/actions/topics";
import { TopicForm } from "@/components/TopicForm";

export default async function NewTopicPage() {
  const existingTopics = await getTopicsForNeighbors();
  return <TopicForm existingTopics={existingTopics} />;
}
