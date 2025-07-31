import Canvas from "@/components/Canvas";

const RoomPage: React.FC = ({params}: {params: {roomId: string}}) => {
  return (
    <div>
      <h1>Room ID: {params.roomId}</h1>
      <Canvas />
    </div>
  );
}

export default RoomPage;
