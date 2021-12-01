from typing import ClassVar
import unittest
from unittest.mock import patch
from routes import encodepassword


class LoginUser(unittest.TestCase):
    def setUp(self):
        self.mock_db = [
            ["admin", "demo", "password"],
            ["b'YWRtaW4='", "b'ZGVtbw=='", "b'cGFzc3dvcmQ='"]
        ]

    def test_user(self):
        with patch("routes.UserCredential.query") as mocked_query:
            for i in range(0, len(self.mock_db[0])):
                result = encodepassword(self.mock_db[0][i])
                self.assertEqual(str(result), self.mock_db[1][i])


if __name__ == "__main__":
    unittest.main()
