const channels = [
  "Channel 1",
  "Channel 2",
  "Channel 3",
  "Channel 4",
  "Channel 5",
]

const [id, setId] = useState(null);
const [show, setShow] = useState(false);

channels.map((channel) => (
  <Item key={channel}>
    <div className="third-column">
    <Button 
      onClick= {
        () => {
          setId(channel);
          setShow(true);
        }
      }
      />
    </div>
    {
      show && id === channel && (
        <Item2>
          <div className="first-column">
            Select 1
          </div>
        </Item2>
      )
    }
  </Item>
))